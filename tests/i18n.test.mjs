// Every string the home page, nav and footer pass through text() must exist in each extra language,
// with the same {placeholders}. Adding English copy without translating it fails here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const read = (f) => fs.readFileSync(path.join(src, f), 'utf8');
const lit = String.raw`'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"`;

function englishStrings() {
  const out = new Set();
  const add = (m, i = 1) => out.add((m[i] ?? m[i + 1]).replace(/\\'/g, "'"));
  for (const f of ['Landing.jsx', 'V2Shell.jsx']) {
    const s = read(f);
    for (const m of s.matchAll(new RegExp(String.raw`text\((?:${lit})\s*,`, 'g'))) add(m);
    for (const m of s.matchAll(new RegExp(String.raw`\[(?:${lit}),\s*(?:${lit})\]`, 'g'))) add(m);
    for (const m of s.matchAll(new RegExp(String.raw`\[(?:${lit}),\s*(?:${lit}),\s*\[`, 'g'))) add(m);
  }
  const c = read('content.js');
  const home = c.slice(c.indexOf('export const HOME_COPY'), c.indexOf('export const TICKER'));
  for (const m of home.matchAll(new RegExp(String.raw`\[(?:${lit}),\s*(?:${lit})\]`, 'g'))) add(m);
  for (const m of home.matchAll(new RegExp(String.raw`\[(?:${lit}),\s*(?:${lit}),\s*(?:${lit}),\s*'/`, 'g'))) { add(m, 1); add(m, 3); }
  const nav = c.slice(c.indexOf('export const SITE_NAV'), c.indexOf('export const HOME_COPY'));
  for (const m of nav.matchAll(/\['([^']+)', '\//g)) out.add(m[1]);
  const shell = read('V2Shell.jsx');
  for (const m of shell.slice(shell.indexOf('const DIRECTORY')).matchAll(/\['([^']+)', '\//g)) out.add(m[1]);
  // names and brands are the same in every language
  return [...out].filter((s) => /[A-Za-z]/.test(s) && !/^(Discord|GitHub|Instagram|Blog|VoxelPort)$/.test(s));
}

const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

for (const code of ['hi', 'pt', 'de', 'fr']) {
  test(`${code}: every home page, nav and footer string is translated, with the same placeholders`, async () => {
    const dict = (await import(pathToFileURL(path.join(src, 'i18n', `${code}.js`)).href)).default;
    const strings = englishStrings();
    assert.ok(strings.length > 100, 'the extractor found the strings');
    const missing = strings.filter((s) => !(s in dict));
    assert.deepEqual(missing, [], `missing in ${code}.js`);
    for (const s of strings) assert.equal(placeholders(dict[s]), placeholders(s), `${code}.js changes the placeholders of "${s}"`);
  });
}
