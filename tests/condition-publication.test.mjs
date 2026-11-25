import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createContext, runInContext } from 'node:vm';
import { test } from 'node:test';
import renderer from '../site/tools/render-conditions.js';
import buildLib from '../site/tools/build-lib.js';

const host = 'https://vipmagicalphysio.com';
const slug = 'back-pain-physiotherapy';
const options = { requireReview: true, date: '2026-11-25', legacy: buildLib.LEGACY };
const path = language => `${language}/conditions/${slug}/`;

async function content() {
  const context = createContext({ window: {} });
  for (const language of renderer.LANGS) {
    const script = await readFile(new URL(`../site/content/conditions.${language}.js`, import.meta.url), 'utf8');
    runInContext(script, context);
  }
  return context.window.COND;
}

test('P0-08: drafts stay out of the public output and old routes have a service-directory fallback', async () => {
  const draft = await content();
  const output = renderer.renderAll(draft, options);
  for (const language of renderer.LANGS) {
    assert.equal(Object.hasOwn(output, `${path(language)}index.html`), false);
    assert.ok(output['_redirects'].includes(`/${path(language)} /services/${slug}.html 302`));
    assert.ok(output[`${language}/conditions/index.html`].includes('href="/services"'));
    assert.ok(!output['sitemap.xml'].includes(`${host}/${path(language)}`));
    const details = draft[language].items.find(item => item.slug === slug);
    assert.ok(!output['assets/services-index.js'].includes(details.intro));
  }
});

test('P0-09: publication requires dated sign-off for every locale and uses the actual review date', async () => {
  const draft = await content();
  const approve = (language, reviewedOn) => Object.assign(draft[language].items.find(item => item.slug === slug), { reviewed: true, reviewedOn });
  approve('en', '2026-11-20');
  approve('mr', '2026-11-21');
  approve('hi', '2026-11-26');
  assert.equal(Object.hasOwn(renderer.renderAll(draft, options), `${path('en')}index.html`), false);
  approve('hi', '2026-11-22');
  const output = renderer.renderAll(draft, options);
  for (const language of renderer.LANGS) {
    const page = output[`${path(language)}index.html`];
    assert.ok(page.includes(`${host}/${path(language)}`));
    assert.ok(output['sitemap.xml'].includes(`${host}/${path(language)}`));
  }
  assert.ok(output[`${path('hi')}index.html`].includes('"lastReviewed":"2026-11-22"'));
});
