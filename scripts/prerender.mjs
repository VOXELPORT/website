// Post-build: writes a real HTML file per route (dist/servers/index.html, …)
// with that page's title, description, canonical URL and social tags, plus a
// plain-text version of the page inside #root for crawlers and link previews
// that don't run JavaScript (React replaces it on load). Also writes
// sitemap.xml and robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, FAQ, SITE, homeJsonLd } from '../src/seo.js';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function replaceOnce(html, re, value) {
  if (!re.test(html)) throw new Error(`prerender: pattern not found: ${re}`);
  return html.replace(re, () => value);
}

const NAV = [['Home', '/'], ['Server list', '/servers'], ['Relay status', '/status'], ['Legal & privacy', '/legal'], ['Get it on Microsoft Store', 'https://apps.microsoft.com/detail/9NGRX9CFNBD6']];

function fallback(key, page) {
  const parts = [`<main class="prerender">`, `<h1>${esc(page.heading)}</h1>`];
  for (const p of page.summary) parts.push(`<p>${esc(p)}</p>`);
  if (page.points) parts.push(`<ul>${page.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`);
  if (key === 'home') {
    parts.push('<h2>Frequently asked questions</h2>');
    for (const f of FAQ) parts.push(`<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`);
  }
  parts.push(`<nav>${NAV.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join(' · ')}</nav>`, '</main>');
  return parts.join('');
}

function render(key) {
  const page = PAGES[key];
  const url = SITE + page.path;
  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(page.description)}" />`);
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = replaceOnce(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(page.title)}" />`);
  html = replaceOnce(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(page.description)}" />`);
  html = replaceOnce(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(page.title)}" />`);
  html = replaceOnce(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(page.description)}" />`);
  if (key === 'home') {
    const ld = homeJsonLd().map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n    ');
    html = replaceOnce(html, /<\/head>/, `    ${ld}\n  </head>`);
  }
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${fallback(key, page)}</div>`);
  return html;
}

for (const key of Object.keys(PAGES)) {
  const out = key === 'home' ? path.join(dist, 'index.html') : path.join(dist, PAGES[key].path.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(key));
}

const today = new Date().toISOString().slice(0, 10);
const priority = { home: '1.0', servers: '0.8', status: '0.5', legal: '0.3' };
const freq = { home: 'weekly', servers: 'hourly', status: 'daily', legal: 'monthly' };
fs.writeFileSync(path.join(dist, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Object.entries(PAGES).map(([k, p]) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${freq[k]}</changefreq><priority>${priority[k]}</priority></url>`),
  '</urlset>', '',
].join('\n'));
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`prerendered ${Object.keys(PAGES).length} pages, sitemap.xml, robots.txt`);
