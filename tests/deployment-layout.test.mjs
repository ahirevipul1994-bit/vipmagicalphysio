import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const config = readFileSync(join(root, 'netlify.toml'), 'utf8');
const publish = resolve(root, config.match(/^\s*publish\s*=\s*"([^"]+)"/m)[1]);
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

test('published website excludes the server, database and dependency source trees', () => {
  assert.notEqual(publish, root);
  assert.ok(existsSync(join(publish, 'index.html')));
  const server = resolve(root, 'netlify/server');
  assert.ok(!server.startsWith(publish + '/'));
  for (const path of ['netlify', 'db', 'node_modules', 'tools', 'tests', 'package.json', 'drizzle.config.ts']) {
    assert.equal(existsSync(join(publish, path)), false, path + ' must remain outside the publish folder');
  }
});

test('published pages retain their relative links, stylesheets, scripts and images', () => {
  const missing = [];
  for (const path of files(publish).filter(path => path.endsWith('.html'))) {
    const html = readFileSync(path, 'utf8');
    for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(link)) continue;
      const pathname = link.split(/[?#]/)[0];
      if (!pathname) continue;
      const target = pathname.startsWith('/') ? resolve(publish, '.' + pathname) : resolve(dirname(path), pathname);
      if (!existsSync(target)) missing.push({ page: path.slice(publish.length + 1), link });
    }
  }
  assert.deepEqual(missing, []);
});
