import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { createEnquiryHandler } from '../netlify/server/enquiries.mjs';

const origin = 'https://example.netlify.app';
const team = { deploy: { context: 'deploy-preview' }, user: { id: 'reviewer-test' } };
const database = new PGlite();
const sql = async (strings, ...values) => (await database.query(
  strings.reduce((query, text, index) => query + (index === 0 ? '' : `$${index}`) + text, ''), values,
)).rows;
const handler = createEnquiryHandler(() => sql);
const call = (method = 'GET', body, context = team, headers = {}) => handler(new Request(`${origin}/api/preview/enquiries`, {
  method,
  headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
  ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
}), context);

before(async () => {
  const migration = await readFile(new URL('../netlify/database/migrations/20261125190000_create_preview_enquiries.sql', import.meta.url), 'utf8');
  await database.exec(migration);
});
after(async () => database.close());

test('P0-01: production, missing identity and foreign origins never reach the database', async () => {
  const locked = createEnquiryHandler(() => assert.fail('unexpected database access'));
  const request = new Request(`${origin}/api/preview/enquiries`, { headers: { 'X-User-Id': 'reviewer-test' } });
  const production = await locked(request, { ...team, deploy: { context: 'production' } });
  assert.equal(production.status, 404);
  assert.equal(production.headers.get('Cache-Control'), 'no-store');
  assert.equal((await locked(request, { deploy: team.deploy })).status, 401);
  for (const method of ['POST', 'PATCH']) {
    assert.equal((await call(method, {}, team, { Origin: 'https://other.example' })).status, 403);
  }
});

test('P0-02: the API rejects unexpected fields, unsupported options and malformed bodies', async () => {
  const sample = { id: randomUUID(), type: 'home', language: 'mr', synthetic: true };
  for (const body of [{ ...sample, name: 'not accepted' }, { ...sample, synthetic: false },
    { ...sample, type: 'other' }, { ...sample, language: 'other' }, { ...sample, id: 'invalid' },
    '{', ' '.repeat(1025) + '{}']) {
    assert.equal((await call('POST', body)).status, 400);
  }
  assert.equal((await call('POST', sample, team, { 'Content-Type': 'text/plain' })).status, 400);
  assert.equal((await call('DELETE')).status, 405);
  assert.deepEqual(await (await call()).json(), { enquiries: [], hasMore: false });
});

test('P0-03: a retry persists one sample and conflicting reuse does not overwrite it', async () => {
  const sample = { id: randomUUID(), type: 'online', language: 'hi', synthetic: true };
  const responses = await Promise.all([call('POST', sample), call('POST', sample)]);
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { id: sample.id });
  }
  assert.equal((await call('POST', { ...sample, type: 'home' })).status, 409);
  assert.equal((await call('POST', sample, { ...team, user: { id: 'different-reviewer' } })).status, 409);
  const { enquiries } = await (await call()).json();
  assert.equal(enquiries.length, 1);
  assert.equal(enquiries[0].appointment_type, 'online');
  assert.equal(enquiries[0].status, 'new');
  assert.equal(Object.hasOwn(enquiries[0], 'created_by'), false);
});

test('P0-04: state changes write one audit event and reject stale updates', async () => {
  const sample = { id: randomUUID(), type: 'clinic', language: 'en', synthetic: true };
  await call('POST', sample);
  const update = { id: sample.id, previous: 'new', status: 'contacted' };
  const changes = await Promise.all([call('PATCH', update), call('PATCH', update)]);
  assert.deepEqual(changes.map(response => response.status).sort(), [200, 409]);
  assert.equal((await call('PATCH', { ...update, previous: 'contacted', status: 'closed' })).status, 200);
  assert.equal((await call('PATCH', { ...update, previous: 'closed', status: 'new' })).status, 400);
  const { enquiries } = await (await call()).json();
  assert.equal(enquiries.find(row => row.id === sample.id).status, 'closed');
  assert.deepEqual(await sql`SELECT previous_status, new_status, actor_id FROM vip_preview_enquiry_activity
    WHERE enquiry_id = ${sample.id} ORDER BY activity_id`, [
    { previous_status: 'new', new_status: 'contacted', actor_id: team.user.id },
    { previous_status: 'contacted', new_status: 'closed', actor_id: team.user.id },
  ]);
});

test('P0-05: database failure is not reported as success and does not disclose connection details', async context => {
  context.mock.method(console, 'error', () => {});
  const unavailable = createEnquiryHandler(() => { throw new Error('database internals'); });
  const response = await unavailable(new Request(`${origin}/api/preview/enquiries`), team);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'inbox_unavailable' });
});
