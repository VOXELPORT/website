# Deploying the VoxelPort website on Vercel

The site is a static React + Vite build (`npm run build` = `vite build` + `scripts/prerender.mjs`, which writes a real HTML file for every
public page, `sitemap.xml`, `robots.txt`, `llms.txt`, `support.json` and `404.html`). There are **no Vercel Functions and no Edge Middleware**; everything is
static files plus the rules in `vercel.json`. It runs on the free Hobby plan.

Nothing has been deployed, no DNS record has been touched and GitHub Pages is still live. This file is the checklist for doing that yourself.

---

## 0. Read this first: one blocker before `voxelport.in` can move

Today `voxelport.in` is not just the website. The old server behind it still serves two things that **installed apps have hard-coded**:

| Address | Used by | Where it comes from after the move |
|---|---|---|
| `https://voxelport.in/support.json` | desktop and Android apps (Support screen) | built into the site (`dist/support.json`), so Vercel serves it. Nothing to do. |
| `https://voxelport.in/dl/*` (`android.json`, the APK, the private dev feed, `uptime.json`) | Android app updater (refuses any other host), the uptime page | **not part of the site.** `vercel.json` proxies `/dl/*` to `https://dl-origin.voxelport.in/dl/*` |

The rewrite uses a hostname that **does not exist yet**. Before you point `voxelport.in` at Vercel you need all three of these, otherwise Android updates and the uptime page break:

1. A DNS record `dl-origin.voxelport.in` pointing at the old web server (the one that runs `voxelport-web` and the `vp-uptime` timer), **DNS only / not proxied** if the zone is on Cloudflare.
2. A virtual host for `dl-origin.voxelport.in` on that server's reverse proxy (Caddy) that forwards to the same local service that answers `voxelport.in` today. That server change is yours to make; I did not touch the backend. Its Go service already answers `/dl/*` directly when the request does not come through Cloudflare, so no code change is needed.
3. Check it: `curl -I https://dl-origin.voxelport.in/dl/android.json` returns `200` and `Cache-Control: no-cache`.

If you would rather use a different hostname, change the one `destination` line in the `rewrites` section of `vercel.json`. Bandwidth note: Android in-app updates download the APK (about 55 MB) through Vercel's proxy and count toward the Hobby plan's monthly transfer allowance. The website's own download buttons go to GitHub Releases and are not affected.

Everything else in this file can be done and tested on the preview URL first (`voxelport-one.vercel.app`, from the Vercel project you already created), with no DNS change at all.

---

## 1. Import the GitHub repository

1. Vercel dashboard, **Add New → Project**, pick the GitHub repository `VOXELPORT/website` (install the Vercel GitHub app for that repository when asked).
2. Use the project you already created (`voxelport-one`) if you prefer: **Settings → Git → Connect Git Repository**.
3. Production Branch: `main` (**Settings → Git**). Every other branch and pull request gets its own preview deployment.

## 2. Project settings

`vercel.json` already contains the build settings, so these values are what the dashboard should show (it will read them from the file):

| Setting | Value |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | `./` (the repository root; `package.json` is at the top level) |
| Install Command | `npm ci` (the project uses npm and `package-lock.json`) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 22.x (`package.json` requires `>=20.19.0`, which Vite 8 needs) |

## 3. Environment variables

**None are required.** The site is fully public static content; it holds no keys and talks only to public endpoints (relay `/api/status` and `/api/servers`, `voxelport.in/dl/uptime.json`, GitHub's public releases API).

| Variable | Set by | Purpose |
|---|---|---|
| `VERCEL_ENV` | Vercel, automatically (`production` / `preview` / `development`) | `scripts/prerender.mjs` builds noindex pages and a `Disallow: /` robots.txt for everything except `production`. **Do not set it yourself.** |

Rules for the future: never put a secret in a variable starting with `VITE_` (Vite copies those into the public JavaScript). `.env*` files are git-ignored; only `.env.example` (placeholders, no values) is committed. If you ever add a variable, set it per environment under **Settings → Environment Variables** (Production / Preview / Development are separate).

## 4. Web Analytics and Speed Insights

Both packages are installed (`@vercel/analytics`, `@vercel/speed-insights`) and loaded after the page is interactive from `src/main.jsx`, in production builds only. They are cookie-free and use the site's own `/_vercel/...` path, so the Content Security Policy needs no extra host.

In the dashboard open the project, then **Analytics → Enable** and **Speed Insights → Enable**, then redeploy. Data appears after the first visits to the deployed site. The Hobby plan includes both with monthly event limits; Vercel shows the usage and the limit. Neither is a paid add-on unless you choose to upgrade.

## 5. Domains and DNS

1. **Settings → Domains → Add** `voxelport.in`, then add `www.voxelport.in`.
2. Make `voxelport.in` the **primary** domain and set `www.voxelport.in` to **redirect to `voxelport.in`** (Vercel offers this when you add it; it uses a permanent redirect). `vercel.json` also redirects the `www` host permanently as a second layer; the two never loop because both point at the apex.
3. Vercel then shows the exact DNS records it wants for each domain (the **Invalid Configuration** panel, or **Domains → Edit**). **Create exactly those values at your DNS provider and nothing else; do not copy values from anywhere else, including old documentation.** I have not written any value here on purpose, because Vercel can show different targets per project and over time.
4. Where the DNS zone is on Cloudflare, create the records as **DNS only (grey cloud)**. Vercel needs to answer TLS itself; proxying through Cloudflare in front of it is not recommended and can cause redirect loops and certificate errors.
5. Do **not** change the other `voxelport.in` records. The relays (`play`, `play-eu`, `play-la`, `relay`, `eu`, `la`, `direct`), `accounts` and the rest must stay exactly as they are; only the apex and `www` records change, and the new `dl-origin` record from section 0 is added.
6. Vercel issues the SSL certificate automatically once the records resolve (usually within minutes). Check **Domains** shows "Valid Configuration".

## 6. Production and preview deployments

* **Production:** every push to `main` deploys to `voxelport.in` (after the domain is attached). Until then it deploys to `voxelport-one.vercel.app`.
* **Preview:** every other branch and pull request gets its own URL. Previews are **never indexed**: the build writes `<meta name="robots" content="noindex, nofollow">` on every page and a `Disallow: /` robots.txt, and Vercel itself adds `X-Robots-Tag: noindex` to preview deployments. Their canonical tags still point at `https://voxelport.in`.
* **Deployment Protection** (Settings) can stay on for previews; production is public.
* A **Hobby** project is for personal, non-commercial use under Vercel's terms. VoxelPort is a free project with a voluntary tip jar; read their current terms and decide whether that fits, or whether a paid plan is needed. I did not enable anything paid.

## 7. Cutover order (nothing here has been done)

1. Deploy to the preview URL. Run the checks in section 8 against it.
2. Do section 0 (`dl-origin`), then `curl https://voxelport-one.vercel.app/dl/android.json` must return the real update feed through the rewrite.
3. Add the domain (section 5) and wait for "Valid Configuration".
4. Run the section 8 checks again against `https://voxelport.in`.
5. Update the two things that still point at the old hosts: the `vp-uptime` probe for the website (`https://voxelport.github.io/`, change it to `https://voxelport.in/`) and the Discord bot's website links if any use the old host. These live on servers, not in this repository.
6. Only after all of that is verified: handle the old GitHub Pages address (section 10).

## 8. Verify after deploying

Run these against the preview URL, then again against `https://voxelport.in`.

```bash
# Local, before any deploy (works offline):
npm ci && npm run build && npm run verify        # production build, 37 pages: titles, canonicals, JSON-LD, links, secrets, 404.html
VERCEL_ENV=preview npm run build && VERCEL_ENV=preview npm run verify    # preview build must be noindex everywhere
```

Against the live site:

```bash
curl -sI https://voxelport.in/ | head -20                       # 200, HSTS, content-security-policy, x-frame-options
curl -sI http://voxelport.in/ | head -5                         # redirects to https
curl -sI https://www.voxelport.in/guides | head -5              # 308/301 to https://voxelport.in/guides, one hop
curl -sI https://voxelport.in/features/ | head -5               # redirects to /features (no trailing slash)
curl -s -o /dev/null -w "%{http_code}\n" https://voxelport.in/features                 # 200 on a direct visit
curl -s -o /dev/null -w "%{http_code}\n" https://voxelport.in/this-page-does-not-exist # 404, not 200
curl -s https://voxelport.in/robots.txt                         # Allow: / and the sitemap line
curl -s https://voxelport.in/sitemap.xml | head                 # 37 urls, all https://voxelport.in/...
curl -s https://voxelport.in/guides/free-minecraft-server-hosting-usa | grep -E "<title>|canonical|og:url|<h1"
curl -sI https://voxelport.in/assets/<a file from dist/assets> | grep -i cache-control      # public, max-age=31536000, immutable
curl -s https://voxelport.in/support.json | head                # the supporter list the apps read
curl -sI https://voxelport.in/dl/android.json | head -5         # 200 from the dl origin, Cache-Control: no-cache
```

In a browser: open a few pages directly and refresh them; open the browser console and check there are **no Content Security Policy errors** on Home, Status, Uptime and a guide. Check **SSL**: the padlock, and `https://www.ssllabs.com/ssltest/` should show a valid Vercel certificate. **SEO:** run Google's Rich Results Test on the home page and the FAQ page, view source on a guide and confirm the article text is in the HTML (not only after JavaScript), then in Google Search Console add the `voxelport.in` property, submit `https://voxelport.in/sitemap.xml` and use URL Inspection on the home page.

## 9. Roll back a failed deployment

* **Instant rollback:** dashboard → **Deployments**, open the last good production deployment, **⋯ → Promote to Production** (or **Instant Rollback**). It takes effect in seconds and needs no rebuild.
* From the terminal: `npx vercel rollback` (or `npx vercel promote <deployment-url>`).
* A bad commit: revert it on `main` (`git revert <sha>`, push); Vercel rebuilds.
* If the **domain** is the problem (wrong DNS, certificate not issuing): restore the previous apex and `www` records at your DNS provider. The old setup keeps working because GitHub Pages and the old server were not touched.

## 10. The old `voxelport.github.io` address

Vercel cannot control a GitHub Pages site, and GitHub Pages cannot send an HTTP 301. What this repository already does: every page now declares `https://voxelport.in/...` as its **canonical** address, so search engines treat any copy still on `voxelport.github.io` as a duplicate of the new one. To finish the job, after the Vercel site is verified:

1. **Do not turn the old site into a redirect to `voxelport.in`.** For years the old server answered `voxelport.in` with a permanent redirect to `voxelport.github.io`, and browsers that saw it keep that redirect cached indefinitely. A visitor with the cached redirect would bounce between the two addresses forever if `github.io` also redirected back. Leave `voxelport.github.io` serving the full site: every page there already declares `https://voxelport.in/...` as its canonical address, which is the signal search engines follow to treat it as a duplicate and move the ranking over time. (A browser with the stale redirect fixes itself by clearing the cache for `voxelport.in`, or opening it in a private window.)
2. Keep running `deploy/publish-pages.sh` whenever the site changes, so the old address never shows outdated content, **or** stop publishing and leave the last copy as it is. Either is safe.
3. In Google Search Console, if you have the `voxelport.github.io` property verified, use **Settings → Change of address** to `voxelport.in`. Otherwise just keep both properties and watch the old one shrink.
4. Keep the stub for several months. Update the places that link to the old address (the README of the app repositories, the Discord announcement posts and bot messages, social bios), none of which are in this repository.
5. Do not disable GitHub Pages until the Vercel deployment has run cleanly for a while and the stub has done its job.

---

## What changed in this repository

* `src/seo.js`, `index.html`, `scripts/prerender.mjs`: canonical, Open Graph, Twitter, JSON-LD, sitemap and robots now use `https://voxelport.in`.
* `scripts/prerender.mjs`: writes `404.html` (noindex, no canonical) so unknown addresses return a real 404; preview builds are noindex with `Disallow: /`.
* `vercel.json`: framework and build settings, clean URLs without trailing slashes (matching the canonical URLs), the old catch-all rewrite to `/index.html` removed (it answered every unknown address with 200), `www` to apex redirect, the `/dl/*` rewrite, security headers and a Content Security Policy, immutable caching for `/assets/` and `/fonts/`.
* `public/theme-init.js` and `index.html`: the one inline script moved into the existing script file so the CSP can forbid inline scripts.
* `src/main.jsx`, `package.json`, `package-lock.json`: Vercel Web Analytics and Speed Insights, loaded when idle in production builds only; `engines.node` added.
* `scripts/verify-build.mjs` (`npm run verify`): offline checks of the finished build. `.env.example` and a `.gitignore` exception for it.
* `deploy/deploy.sh`, `deploy/publish-pages.sh`: marked legacy in a comment; nothing was removed, because both are still needed until the cutover is complete (the old server still serves `/dl/`).

## Known limits

* The Content Security Policy allows `style-src 'unsafe-inline'` because the React pages use inline `style` attributes. Scripts are locked to `'self'`.
* No Lighthouse run was possible offline. The home page loads about 84 kB of JavaScript and 15 kB of CSS (gzip), fonts are self-hosted and preloaded, and every page except Home loads its code on demand, so mobile performance should be good, but measure it on the deployed site with Speed Insights and PageSpeed Insights.
* `vercel.json` rules (headers, redirects, the `/dl/` rewrite) were checked for syntax and, for headers and 404 handling, against a local stand-in server, not against Vercel itself. Re-check with section 8 on the first preview deployment.
