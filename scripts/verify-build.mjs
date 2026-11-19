// Checks the finished build in dist/ the way a crawler and a browser would see it, with no network:
//   npm run build && npm run verify
// Every public route has its own HTML file with unique metadata and a canonical address on https://voxelport.in, the sitemap and
// robots.txt agree with that, every local file the pages point at exists, 404.html is not indexable, the old Pages host is gone
// and nothing that looks like a secret ended up in the output.
// With VERCEL_ENV=preview in the environment it instead checks that the build is noindex everywhere.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const ORIGIN = 'https://voxelport.in';
const preview = !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

const failures = [];
const fail = (m) => failures.push(m);
const read = (p) => fs.readFileSync(path.join(dist, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(dist, p));
const attr = (html, re) => (html.match(re) || [])[1];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

// Which file answers a public path (Vercel with cleanUrls and no trailing slash).
const fileFor = (urlPath) => {
  if (urlPath === '/') return 'index.html';
  const clean = urlPath.replace(/^\//, '');
  if (exists(`${clean}/index.html`)) return `${clean}/index.html`;
  if (exists(clean) && fs.statSync(path.join(dist, clean)).isFile()) return clean;
  return null;
};

// 1. robots.txt and sitemap
const robots = read('robots.txt');
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (preview) {
  if (!/Disallow: \/\s*$/m.test(robots)) fail('preview build: robots.txt must disallow everything');
} else {
  if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt does not point at the sitemap on voxelport.in');
  if (/Disallow: \/\s*$/m.test(robots)) fail('robots.txt blocks the whole site in a production build');
}
if (urls.length < 20) fail(`sitemap lists only ${urls.length} urls`);
if (new Set(urls).size !== urls.length) fail('sitemap has duplicate urls');

// 2. every sitemap url: its own file, unique title and description, canonical = itself, social tags, JSON-LD
const titles = new Map();
const descriptions = new Map();
for (const url of urls) {
  if (!url.startsWith(ORIGIN)) { fail(`${url}: not on ${ORIGIN}`); continue; }
  if (url.length > ORIGIN.length + 1 && url.endsWith('/')) fail(`${url}: trailing slash (canonical urls have none)`);
  const p = url.slice(ORIGIN.length) || '/';
  const file = fileFor(p);
  if (!file) { fail(`${p}: no prerendered file in dist`); continue; }
  const html = read(file);
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (!title) fail(`${p}: no <title>`);
  else if (titles.has(title)) fail(`${p}: same title as ${titles.get(title)}`);
  else titles.set(title, p);
  if (!desc) fail(`${p}: no meta description`);
  else if (descriptions.has(desc)) fail(`${p}: same description as ${descriptions.get(desc)}`);
  else descriptions.set(desc, p);
  if (canonical !== url) fail(`${p}: canonical is ${canonical}, expected ${url}`);
  if (attr(html, /<meta property="og:url" content="([^"]*)"/) !== url) fail(`${p}: og:url differs from the canonical address`);
  for (const tag of ['og:title', 'og:description', 'og:image']) if (!html.includes(`property="${tag}"`)) fail(`${p}: missing ${tag}`);
  for (const tag of ['twitter:card', 'twitter:title', 'twitter:image']) if (!html.includes(`name="${tag}"`)) fail(`${p}: missing ${tag}`);
  if (!attr(html, /<meta property="og:image" content="(https:\/\/voxelport\.in\/[^"]+)"/)) fail(`${p}: og:image is not an absolute voxelport.in url`);
  const robotsMeta = attr(html, /<meta name="robots" content="([^"]*)"/) || '';
  if (preview ? !/noindex/.test(robotsMeta) : /noindex/.test(robotsMeta)) fail(`${p}: robots meta is "${robotsMeta}"`);
  const body = attr(html, /<div id="root">([\s\S]*)<\/div>\s*<\/body>/) || '';
  if ((body.match(/<h1[ >]/g) || []).length !== 1) fail(`${p}: expected exactly one <h1> of real content in the static HTML`);
  if (body.replace(/<[^>]+>/g, ' ').trim().length < 150) fail(`${p}: static HTML has too little text for crawlers`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(`${p}: JSON-LD does not parse`); }
  }
  if (!html.includes('application/ld+json')) fail(`${p}: no JSON-LD`);
}

// 3. 404.html
if (!exists('404.html')) fail('404.html is missing: unknown addresses would not return a real 404');
else {
  const h = read('404.html');
  if (!/noindex/.test(attr(h, /<meta name="robots" content="([^"]*)"/) || '')) fail('404.html must be noindex');
  if (/rel="canonical"/.test(h)) fail('404.html must not have a canonical address');
}

// 4. local files that pages reference exist (assets, fonts, icons, scripts, internal links)
const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const seen = new Set();
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(dist, f);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const target = m[1];
    const key = `${rel} ${target}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (target.startsWith('//')) continue;
    if (target.startsWith('/dl/')) continue; // served by the download origin, not part of the build
    if (!fileFor(target)) fail(`${rel}: links to ${target}, which is not in the build`);
  }
}
const css = read('fonts.css');
for (const m of css.matchAll(/url\('(\/[^']+)'\)/g)) if (!fileFor(m[1])) fail(`fonts.css: ${m[1]} is missing`);
for (const f of walk(path.join(dist, 'assets')).filter((x) => x.endsWith('.css'))) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/url\((?!data:)['"]?(\/[^'")]+)['"]?\)/g)) if (!fileFor(m[1])) fail(`${path.basename(f)}: ${m[1]} is missing`);
}

// 5. the old host and secrets must not be in the output
const secretPatterns = [
  [/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]{20,}/i, 'a Discord webhook url'],
  [/\b(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}/, 'a GitHub token'],
  [/\bsk-[A-Za-z0-9]{20,}/, 'an API key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'a private key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'an AWS key'],
  [/\b[MN][A-Za-z\d]{23,25}\.[\w-]{6}\.[\w-]{27,}/, 'a Discord bot token'],
  [/(?:api[_-]?key|secret|password|passwd)["']?\s*[:=]\s*["'][A-Za-z0-9+/_-]{16,}["']/i, 'a hard-coded credential'],
];
for (const f of walk(dist)) {
  if (/\.(woff2|png|ico|gif|mp4)$/.test(f)) continue;
  const text = fs.readFileSync(f, 'utf8');
  const rel = path.relative(dist, f);
  if (text.includes('voxelport.github.io')) fail(`${rel}: still mentions voxelport.github.io`);
  for (const [re, what] of secretPatterns) if (re.test(text)) fail(`${rel}: looks like it contains ${what}`);
}

// 6. static files that must survive the move
for (const f of ['support.json', 'llms.txt', 'og-image.png', 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'theme-init.js', 'ec3e6f769f880b4a8b58696044bcf8e9.txt', 'googlec669d8304b2be68c.html']) {
  if (!exists(f)) fail(`${f} is missing from the build`);
}
if (exists('support.json')) { try { JSON.parse(read('support.json')); } catch { fail('support.json is not valid JSON'); } }
if (htmlFiles.some((f) => /<script>[^<]/.test(fs.readFileSync(f, 'utf8')))) fail('an inline <script> is in the HTML, which the Content Security Policy blocks');

if (failures.length) {
  console.error(`verify-build: ${failures.length} problem(s)\n - ` + failures.join('\n - '));
  process.exit(1);
}
console.log(`verify-build: ok (${preview ? 'preview, noindex' : 'production'}; ${urls.length} sitemap urls, ${htmlFiles.length} html files)`);
