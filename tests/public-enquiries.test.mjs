import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

const read = path => readFile(new URL(`../site/${path}`, import.meta.url), 'utf8');

test('P0-06: legacy cleanup removes only enquiry data and leaves preferences unchanged', async () => {
  const data = new Map(Object.entries({
    px_booking_draft_v1: '', px_last_enquiry: '', px_last_request: '', px_requests: '',
    px_leads: '', px_crm_queue: '', px_lang: 'mr', px_consent: 'no',
  }));
  runInNewContext(await read('assets/crm.js'), { localStorage: { removeItem: key => data.delete(key) } });
  assert.deepEqual([...data], [['px_lang', 'mr'], ['px_consent', 'no']]);
});

test('P0-07: public forms no longer trigger local lead capture or default to query-string submissions', async () => {
  assert.doesNotMatch(await read('assets/site.js'), /PXCRM|px:capture|px_booking_draft|px_last_request|px_last_enquiry/);
  for (const page of ['booking', 'contact', 'home-visit', 'ebooks', 'resources']) {
    const html = await read(`${page}.html`);
    assert.match(html, /<form method="post"/);
    assert.match(html, /assets\/site\.js\?v=20261125/);
    assert.doesNotMatch(html, /data-copy-payload/);
  }
});
