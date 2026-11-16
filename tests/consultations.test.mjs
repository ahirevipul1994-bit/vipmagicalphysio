import test from 'node:test';
import assert from 'node:assert/strict';
import { split, isStaff, meetingLink, futureDate, googleUrl, staffChanges } from '../netlify/server/policies.mjs';
import { createApp } from '../netlify/server/app.mjs';
import { PgDialect } from 'drizzle-orm/pg-core';

const tomorrow = () => new Date(Date.now() + 86400000).toISOString();
const record = (changes = {}) => ({ id: 'booking', status: 'requested', paymentStatus: 'unpaid', settlementStatus: 'pending', ...changes });

test('revenue splits preserve every paise across fractional shares and rounding', () => {
  for (const fee of [100, 19999, 125050, 9999999]) for (const bps of [0, 1375, 2500, 3333, 10000]) {
    const amounts = split(fee, bps);
    assert.equal(amounts.feePaise, amounts.clinicSharePaise + amounts.doctorSharePaise);
    assert.ok(amounts.clinicSharePaise >= 0 && amounts.doctorSharePaise >= 0);
  }
  assert.deepEqual(split(19999, 1375), { feePaise: 19999, clinicSharePaise: 2750, doctorSharePaise: 17249 });
  for (const input of [[0, 100], [-100, 300], [1.1, 1000], [1000, -1], [1000, 10001], [Infinity, 500]]) assert.throws(() => split(...input));
});
test('staff privileges come only from controlled app metadata', () => {
  assert.equal(isStaff({ user_metadata: { roles: ['admin'] } }), false);
  assert.equal(isStaff({ app_metadata: { roles: ['patient'] } }), false);
  assert.equal(isStaff({ app_metadata: { roles: ['doctor'] } }), false);
  assert.equal(isStaff({ app_metadata: { roles: ['staff'] } }), true);
  assert.equal(isStaff({ app_metadata: { roles: ['admin'] } }), true);
});
test('meeting and review links reject script schemes, lookalike domains and embedded credentials', () => {
  assert.equal(meetingLink('https://meet.google.com/abc-defg-hij'), 'https://meet.google.com/abc-defg-hij');
  assert.equal(googleUrl('https://maps.app.goo.gl/clinic'), 'https://maps.app.goo.gl/clinic');
  for (const value of ['javascript:alert(1)', 'http://meet.google.com/test', 'https://meet.google.com.attacker.test', 'https://user:password@zoom.us/j/123']) assert.throws(() => meetingLink(value));
  for (const value of ['javascript:alert(1)', 'https://google.com.attacker.test']) assert.throws(() => googleUrl(value));
  assert.throws(() => futureDate('2020-01-01'));
  assert.throws(() => futureDate('not a date'));
  assert.equal(futureDate(tomorrow()).length, 24);
});
test('payment claims cannot skip verification or pay out an uncompleted consultation', () => {
  assert.throws(() => staffChanges(record(), { action: 'verify' }));
  assert.throws(() => staffChanges(record({ paymentStatus: 'submitted' }), { action: 'confirm', scheduledAt: tomorrow(), meetingUrl: 'https://meet.google.com/abc-defg-hij' }));
  assert.deepEqual(staffChanges(record({ paymentStatus: 'submitted' }), { action: 'verify' }), { paymentStatus: 'verified' });
  const confirmed = staffChanges(record({ paymentStatus: 'verified' }), { action: 'confirm', scheduledAt: tomorrow(), meetingUrl: 'https://meet.google.com/abc-defg-hij' });
  assert.equal(confirmed.status, 'confirmed');
  for (const state of [record(), record({ status: 'confirmed', paymentStatus: 'verified' }), record({ status: 'completed', paymentStatus: 'submitted' }), record({ status: 'completed', paymentStatus: 'verified', settlementStatus: 'paid' })]) assert.throws(() => staffChanges(state, { action: 'settle', reference: 'PAYOUT123456' }));
  assert.deepEqual(staffChanges(record({ status: 'completed', paymentStatus: 'verified' }), { action: 'settle', reference: 'PAYOUT123456' }), { settlementStatus: 'paid', settlementReference: 'PAYOUT123456' });
});
test('refund recording requires a cancelled verified payment that has not been settled', () => {
  assert.throws(() => staffChanges(record({ paymentStatus: 'verified' }), { action: 'refund' }));
  assert.throws(() => staffChanges(record({ status: 'cancelled', paymentStatus: 'verified', settlementStatus: 'paid' }), { action: 'refund' }));
  assert.deepEqual(staffChanges(record({ status: 'cancelled', paymentStatus: 'verified' }), { action: 'refund' }), { paymentStatus: 'refunded' });
});
test('private API requests require authentication before accessing the database', async () => {
  const db = new Proxy({}, { get() { throw new Error('Database must not be accessed'); } });
  const app = createApp(db, async () => null);
  for (const path of ['/api/me', '/api/appointments', '/api/staff/doctors']) {
    const response = await app.request(path);
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
});
test('public signup metadata cannot unlock staff APIs', async () => {
  const db = new Proxy({}, { get() { throw new Error('Database must not be accessed'); } });
  const app = createApp(db, async () => ({ id: 'patient', user_metadata: { roles: ['admin'] } }));
  assert.equal((await app.request('/api/staff/doctors')).status, 403);
  assert.equal((await app.request('/api/appointments?view=staff')).status, 403);
});
test('state-changing requests reject cross-origin and missing-origin requests', async () => {
  const app = createApp({}, async () => ({ id: 'patient' }));
  for (const origin of [null, 'https://attacker.test']) {
    const response = await app.request('https://clinic.test/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: '{}' });
    assert.equal(response.status, 403);
  }
});
test('patient appointment queries are restricted to the authenticated account', async () => {
  let condition;
  const query = { from() { return this; }, innerJoin() { return this; }, where(value) { condition = value; return this; }, orderBy() { return Promise.resolve([]); } };
  const app = createApp({ select: () => query }, async () => ({ id: 'patient-private-id' }));
  const response = await app.request('/api/appointments');
  assert.equal(response.status, 200);
  const sql = new PgDialect().sqlToQuery(condition);
  assert.match(sql.sql, /patient_id/);
  assert.deepEqual(sql.params, ['patient-private-id']);
});
test('payment updates enforce patient ownership and one submission per unpaid request', async () => {
  let condition, update;
  const db = {
    select: () => ({ from() { return this; }, where: async () => [{ upiId: 'clinic@bank', payeeName: '' }] }),
    update: () => ({ set(values) { update = values; return this; }, where(value) { condition = value; return this; }, returning: async () => [] }),
  };
  const app = createApp(db, async () => ({ id: 'patient-private-id' }));
  const response = await app.request('https://clinic.test/api/appointments/foreign-id/payment', { method: 'POST', headers: { Origin: 'https://clinic.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ reference: '123456789012' }) });
  assert.equal(response.status, 409);
  const sql = new PgDialect().sqlToQuery(condition);
  assert.match(sql.sql, /patient_id/);
  assert.ok(sql.params.includes('patient-private-id'));
  assert.ok(sql.params.includes('unpaid'));
  assert.ok(sql.params.includes('requested'));
  assert.equal(update.paymentStatus, 'submitted');
});

test('staff can preserve the UPI ID and add a Google link later without inventing a recipient name', async () => {
  let saved;
  const db = { insert: () => ({ values(values) { saved = values; return this; }, onConflictDoUpdate: async () => [] }) };
  const app = createApp(db, async () => ({ id: 'staff', app_metadata: { roles: ['admin'] } }));
  const response = await app.request('https://clinic.test/api/staff/settings', {
    method: 'POST', headers: { Origin: 'https://clinic.test', 'Content-Type': 'application/json' },
    body: JSON.stringify({ upiId: 'clinic@bank', payeeName: '', googleReviewsUrl: '' }),
  });
  assert.equal(response.status, 200);
  assert.equal(saved.upiId, 'clinic@bank');
  assert.equal(saved.payeeName, '');
  assert.equal(saved.googleReviewsUrl, '');
});
