# SEO report: voxelport.in (2026-11-20)

## Metadata (as built)

| Page | Title |
|---|---|
| Home | VoxelPort — Minecraft Server Manager & Proxy App |
| Features | Minecraft Server Manager & Proxy Features \| VoxelPort |
| Download | Download VoxelPort — Minecraft Server Manager |
| Guides index | Minecraft Server Setup & Proxy Guides \| VoxelPort |
| About | About VoxelPort — Minecraft Server Management Software |

Home description: "Manage Minecraft servers on your own device and connect players through VoxelPort’s relay network without complicated port forwarding." Home heading (the one `<h1>`, also in the static HTML for crawlers): "Your Minecraft Server. Your Control."

The other pages keep their existing, already-unique titles and descriptions (the Compare, Download and Windows-FAQ wording changed; the guides keep their URLs).

## Checks run (`npm run build && npm run verify`, 37 sitemap URLs)

- Every URL has its own prerendered file, a unique title and description, a canonical equal to its own `https://voxelport.in/...` URL, and matching `og:url`, `og:title`, `og:description`, `og:image` (absolute), and `twitter:card/title/image`.
- Exactly one `<h1>` with real text in the static HTML of every page; at least 150 characters of body text per page for crawlers that do not run JavaScript.
- JSON-LD parses on every page (SoftwareApplication, WebSite, FAQPage, BreadcrumbList, Article).
- `sitemap.xml`: 37 URLs, no duplicates, no trailing slashes, none on `github.io`. `robots.txt`: `Allow: /` and the sitemap line in production; `Disallow: /` and `noindex` in preview builds.
- `404.html`: noindex, no canonical; unknown URLs return HTTP 404 (verified on the live site).
- No `voxelport.github.io` string anywhere in the output; no banned wording (hosting-provider claims, "switch Smart App Control off", the dead Android link).
- Image `alt` text present on every `<img>`, all with width and height (home page checked in a browser).

## Structured data

Home: `SoftwareApplication` as a "Minecraft server manager and proxy", version 2.0.0, Windows 10/11 and Android, free, MIT, feature list without hosting claims. FAQ page: `FAQPage` built from the visible FAQ (including "Is VoxelPort a Minecraft hosting service?"). Guides: `Article` and `BreadcrumbList`. No fake ratings or reviews were added.

## Keywords

Preserved where accurate: "Minecraft server without port forwarding" (FAQ, guides, descriptions), "host a Minecraft server" (own PC), "Aternos alternative" (guide). Removed: "free Minecraft server hosting" as a promise in titles, replaced by "run a free Minecraft server" and "server options".

## Not verified / owner actions

- Google Search Console: add the property, submit the sitemap, run URL Inspection (not possible from here).
- The Google site-verification file `/googlec669d8304b2be68c.html` is redirected to a clean URL by Vercel's clean-URL rule; if Search Console asks again, verify with a DNS TXT record or HTML tag.
- Rankings cannot be measured from this environment; none are claimed.

## Re-verification of production (production-verification branch)

`node scripts/audit-live.mjs https://voxelport.in --external` against the live site (run before any change on this branch): 37 sitemap URLs all 200; production HTML equal to a fresh build of `main` for every page; unique titles and descriptions; canonical equal to the page URL everywhere; Open Graph and Twitter tags present; JSON-LD parses; no noindex; an unknown URL returns 404; 48 internal and 19 external links resolve; `robots.txt` and `sitemap.xml` return 200 with the right content types. Preview deployments return `X-Robots-Tag: noindex`. The Discord invite used on the site is valid.

Lighthouse (mobile preset, local production build) SEO score: 100 on all 15 routes tested.
