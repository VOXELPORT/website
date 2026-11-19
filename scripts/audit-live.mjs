// Read-only audit of a running site (production or a preview), the way a crawler sees it. Needs network.
//   node scripts/audit-live.mjs https://voxelport.in [--external]
// Checks every sitemap URL (status, title, description, canonical, robots meta, h1, Open Graph, JSON-LD), compares each page's
// static HTML with the local build in dist/ (is production the latest repository build?), follows every internal link from the
// pages, and with --external also checks the external links. Prints a summary and exits 1 on any problem.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = (process.argv[2] || 'https://voxelport.in').replace(/\/+$/, '');
const external = process.argv.includes('--external');
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const UA = { 'user-agent': 'VoxelPortAudit/1.0 (+https://voxelport.in)' };
const problems = [];
const note = [];
const bad = (m) => problems.push(m);

async function get(url, opts = {}) {
  try {
    const r = await fetch(url, { redirect: 'manual', headers: UA, signal: AbortSignal.timeout(25000), ...opts });
    return r;
  } catch (e) {
    return { status: 0, error: String(e.message || e), headers: new Headers(), text: async () => '' };
  }
}

const attr = (html, re) => (html.match(re) || [])[1];
const localHtml = (p) => {
  const f = p === '/' ? 'index.html' : `${p.slice(1)}/index.html`;
  const full = path.join(dist, f);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
};
const norm = (h) => h.replace(/\s+/g, ' ').replace(/<lastmod>[^<]*<\/lastmod>/g, '').trim();

// 1. robots and sitemap
const robots = await get(`${base}/robots.txt`);
const robotsText = await robots.text();
if (robots.status !== 200) bad(`robots.txt: HTTP ${robots.status}`);
if (!/Sitemap: https:\/\/voxelport\.in\/sitemap\.xml/.test(robotsText) && !/Disallow: \/\s*$/m.test(robotsText)) bad('robots.txt: no sitemap line');
const sm = await get(`${base}/sitemap.xml`);
const smText = await sm.text();
if (sm.status !== 200) bad(`sitemap.xml: HTTP ${sm.status}`);
const urls = [...smText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
note.push(`sitemap: ${urls.length} urls`);

// 2. each page
const pages = new Map();
const titles = new Set();
for (const url of urls) {
  const p = new URL(url).pathname || '/';
  const r = await get(base + p);
  if (r.status !== 200) { bad(`${p}: HTTP ${r.status}${r.headers.get('location') ? ' -> ' + r.headers.get('location') : ''}`); continue; }
  const html = await r.text();
  pages.set(p, html);
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (!title) bad(`${p}: no title`); else if (titles.has(title)) bad(`${p}: duplicate title`); else titles.add(title);
  if (!attr(html, /<meta name="description" content="([^"]*)"/)) bad(`${p}: no description`);
  if (canonical !== url) bad(`${p}: canonical ${canonical} != ${url}`);
  if (/noindex/.test(attr(html, /<meta name="robots" content="([^"]*)"/) || '')) bad(`${p}: noindex in the response`);
  if (/noindex/i.test(r.headers.get('x-robots-tag') || '')) bad(`${p}: X-Robots-Tag noindex`);
  if ((html.match(/<h1[ >]/g) || []).length < 1) bad(`${p}: no h1`);
  for (const t of ['og:title', 'og:description', 'og:image', 'og:url']) if (!html.includes(`property="${t}"`)) bad(`${p}: missing ${t}`);
  for (const t of ['twitter:card', 'twitter:title']) if (!html.includes(`name="${t}"`)) bad(`${p}: missing ${t}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { bad(`${p}: bad JSON-LD`); } }
  // is production the latest build?
  const local = localHtml(p);
  if (local === null) note.push(`${p}: no local build to compare (run npm run build first)`);
  else if (norm(local) !== norm(html)) bad(`${p}: production HTML differs from the local build (not the latest repository version, or a different build)`);
}

// 3. 404
const nf = await get(`${base}/this-page-does-not-exist-audit`);
if (nf.status !== 404) bad(`unknown URL returns ${nf.status}, expected 404`);

// 4. internal links
const seen = new Map();
for (const [p, html] of pages) {
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const t = m[1];
    if (t.startsWith('//') || seen.has(t)) continue;
    seen.set(t, p);
  }
}
for (const [t, from] of seen) {
  const r = await get(base + t, { method: 'HEAD' });
  if (r.status === 308 || r.status === 301 || r.status === 302) bad(`link ${t} (on ${from}) redirects to ${r.headers.get('location')}`);
  else if (r.status !== 200) bad(`link ${t} (on ${from}): HTTP ${r.status}`);
}
note.push(`internal links checked: ${seen.size}`);

// 5. external links
if (external) {
  const ext = new Map();
  for (const [p, html] of pages) for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) { const u = m[1].replace(/&amp;/g, '&'); if (!u.startsWith(base) && !ext.has(u)) ext.set(u, p); }
  const skip = /instagram\.com|linkedin\.com|discord\.gg/; // these block bots
  for (const [u, from] of ext) {
    if (skip.test(u)) continue;
    let r = await get(u, { method: 'HEAD', redirect: 'follow' });
    if (r.status === 405 || r.status === 403 || r.status === 0) r = await get(u, { method: 'GET', redirect: 'follow' });
    if (r.status >= 400 || r.status === 0) bad(`external ${u} (on ${from}): HTTP ${r.status}`);
  }
  note.push(`external links checked: ${ext.size}`);
}

for (const n of note) console.log(n);
if (problems.length) { console.error(`audit-live: ${problems.length} problem(s)\n - ` + problems.join('\n - ')); process.exit(1); }
console.log(`audit-live: ok (${base})`);
