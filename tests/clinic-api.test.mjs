import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import handler from '../netlify/server/index.mjs';

const origin = 'https://clinic.example';
const request = (path, options) => new Request(`${origin}/api/${path}`, options);

test('signed-out users cannot read owner records', async () => {
  const status = await handler(request('owner'));
  assert.deepEqual(await status.json(), { owner: false });
  for (const resource of ['enquiries', 'appointments', 'finance', 'content', 'audit']) {
    const response = await handler(request(resource));
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
  }
});

test('write requests from another origin are rejected', async () => {
  const response = await handler(request('enquiries', {
    method: 'POST', headers: { origin: 'https://other.example', 'content-type': 'application/json' }, body: '{}',
  }));
  assert.equal(response.status, 403);
});

test('malformed, unconsented, bot and incomplete home-visit enquiries are rejected', async () => {
  const enquiry = { name: 'Test Enquiry', phone: '0000000000', kind: 'CLINIC', service: 'not-sure', consent: true, language: 'en', idempotency_key: randomUUID() };
  const submit = (body) => handler(request('enquiries', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' }, body,
  }));
  for (const body of ['{', ...[
    { ...enquiry, consent: false },
    { ...enquiry, website: 'filled' },
    { ...enquiry, kind: 'HOME_VISIT' },
  ].map((value) => JSON.stringify(value))]) {
    assert.equal((await submit(body)).status, 400);
  }
  assert.equal((await submit(JSON.stringify({ ...enquiry, message: 'a'.repeat(9000) }))).status, 413);
});
