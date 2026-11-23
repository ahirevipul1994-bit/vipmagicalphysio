#!/usr/bin/env node
/* Build: node site/tools/build.js public (run during Netlify deploy)
   - Generates /{en,mr,hi}/conditions/** from site/content/conditions.*.js
   - Generates /{en,mr,hi}/index.html from the homepage with per-language canonical/hreflang/title
   - Writes sitemap.xml + assets/services-index.js
   - Keeps condition pages out of the index and sitemap until clinically reviewed. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const SITE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(process.argv[2] || 'public');
const ctx = { window: {} }; vm.createContext(ctx);
['en', 'mr', 'hi'].forEach(l => vm.runInContext(fs.readFileSync(path.join(SITE_DIR, `content/conditions.${l}.js`), 'utf8'), ctx));
vm.runInContext(fs.readFileSync(path.join(SITE_DIR, 'assets/home-i18n.js'), 'utf8'), ctx);
const { renderAll } = require('./render-conditions.js');
const { buildLangHomes, LEGACY } = require('./build-lib.js');

const opts = { date: new Date().toISOString().slice(0, 10), requireReview: true, legacy: LEGACY };
const files = { ...renderAll(ctx.window.COND, opts), ...buildLangHomes(fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8'), ctx.window.VIP_I18N) };
for (const [rel, html] of Object.entries(files)) {
  const out = path.join(OUTPUT_DIR, rel); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
}
console.log(`Built ${Object.keys(files).length} files (requireReview=${opts.requireReview})`);
