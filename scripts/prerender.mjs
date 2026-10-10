// Post-build: writes a real HTML file per route (dist/servers/index.html, …)
// with that page's title, description, canonical URL and social tags, plus a
// plain-text version of the page inside #root for crawlers and link previews
// that don't run JavaScript (React replaces it on load). Also writes
// sitemap.xml and robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, FAQ, SITE, homeJsonLd } from '../src/seo.js';
import { GUIDES, GUIDES_INDEX, GUIDES_UPDATED, guidePath, guideJsonLd } from '../src/guides.js';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function replaceOnce(html, re, value) {
  if (!re.test(html)) throw new Error(`prerender: pattern not found: ${re}`);
  return html.replace(re, () => value);
}

const NAV = [['Home', '/'], ['Guides', '/guides'], ['Server list', '/servers'], ['Relay status', '/status'], ['Legal & privacy', '/legal'], ['Get it on Microsoft Store', 'https://apps.microsoft.com/detail/9NGRX9CFNBD6']];

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
  return renderPage(PAGES[key], key === 'home' ? homeJsonLd() : null, fallback(key, PAGES[key]));
}

function renderPage(page, jsonLd, body) {
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
  if (jsonLd) {
    const ld = jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n    ');
    html = replaceOnce(html, /<\/head>/, `    ${ld}\n  </head>`);
  }
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`);
  return html;
}

const navHtml = () => `<nav>${NAV.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join(' · ')}</nav>`;

function guideBody(g) {
  const faq = g.faq?.length ? '<h2>Questions</h2>' + g.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('') : '';
  return `<main class="prerender"><p><a href="/">Home</a> / <a href="/guides">Guides</a> / ${esc(g.short)}</p><h1>${esc(g.title)}</h1><p>${esc(g.description)}</p>${g.html}${faq}<h2>More guides</h2><ul>${GUIDES.filter((x) => x !== g).map((x) => `<li><a href="${guidePath(x)}">${esc(x.title)}</a></li>`).join('')}</ul>${navHtml()}</main>`;
}

function guidesIndexBody() {
  return `<main class="prerender"><h1>Minecraft server guides</h1><p>${esc(GUIDES_INDEX.description)}</p><ul>${GUIDES.map((g) => `<li><a href="${guidePath(g)}">${esc(g.title)}</a> — ${esc(g.blurb)}</li>`).join('')}</ul>${navHtml()}</main>`;
}

function write(p, html) {
  const out = p === '/' ? path.join(dist, 'index.html') : path.join(dist, ...p.slice(1).split('/'), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

for (const key of Object.keys(PAGES)) write(PAGES[key].path, render(key));
const indexLd = [{
  '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Minecraft server guides', url: SITE + GUIDES_INDEX.path,
  hasPart: GUIDES.map((g) => ({ '@type': 'Article', headline: g.title, url: SITE + guidePath(g) })),
}];
write(GUIDES_INDEX.path, renderPage(GUIDES_INDEX, indexLd, guidesIndexBody()));
for (const g of GUIDES) {
  write(guidePath(g), renderPage({ path: guidePath(g), title: g.title, description: g.description }, guideJsonLd(g, SITE), guideBody(g)));
}

const today = new Date().toISOString().slice(0, 10);
const priority = { home: '1.0', servers: '0.8', status: '0.5', legal: '0.3' };
const freq = { home: 'weekly', servers: 'hourly', status: 'daily', legal: 'monthly' };
fs.writeFileSync(path.join(dist, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Object.entries(PAGES).map(([k, p]) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${freq[k]}</changefreq><priority>${priority[k]}</priority></url>`),
  `  <url><loc>${SITE}${GUIDES_INDEX.path}</loc><lastmod>${GUIDES_UPDATED}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
  ...GUIDES.map((g) => `  <url><loc>${SITE}${guidePath(g)}</loc><lastmod>${GUIDES_UPDATED}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
  '</urlset>', '',
].join('\n'));
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`prerendered ${Object.keys(PAGES).length} pages + ${GUIDES.length + 1} guide pages, sitemap.xml, robots.txt`);
