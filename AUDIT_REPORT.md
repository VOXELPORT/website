# Audit report: voxelport.in (2026-11-20)

Branch: `website-final-fixes`. Method: the repository was compared with the live site (`curl`, headers, rendered pages), the real release data on GitHub, and the app's own build file. Nothing is deployed from this branch.

## What was already done (not repeated)

Vercel build and routing, canonical domain `voxelport.in`, prerendered pages, real 404s, preview noindex, security headers and CSP, `/dl/` proxy to `dl-origin.voxelport.in`, Analytics and Speed Insights, and the first positioning pass ("manager and proxy, not hosting").

## Issues found

| Pri | Issue | Evidence | Status |
|---|---|---|---|
| P0 | **Android download links were broken.** The static page text and `llms.txt` linked `github.com/VOXELPORT/VoxelPort-Android/releases/latest/download/VoxelPort.apk`, which returns 404 (that repository has no public releases). The home page's Android card and the Android hero button only went to an install guide, never to the APK. | `curl -I` on the GitHub URL: 404. Live APK at `voxelport.in/dl/voxelport-android.apk`: 200, 54,638,754 bytes, SHA-256 matches the update feed. | **Fixed:** all Android buttons now point at the real APK; `npm run verify` fails if the dead link returns. |
| P0 | **Windows advice told people to switch off Smart App Control** (FAQ, download page, new-app page, guides, static HTML). | Text in `seo.js`, `MorePages.jsx`, `prerender.mjs`, `guides.js`. | **Fixed:** one shared wording (`src/release.js`): explains the warning, says not to turn it off, gives a SHA-256 check. `verify` fails if the advice returns. |
| P0 | **Download page showed "New app 2.0 · previous app v2.0.0"** (the GitHub "latest" tag is now the new app, so the sticker was wrong). | Code read. | **Fixed:** the page reads versions from a central release file. |
| P0 | The `/download` "redirects to `voxelport.github.io/download/`" report. | See "Redirect investigation". | **Not reproducible now; explained below.** |
| P1 | Titles and descriptions did not match the requested wording; comparison claims were unsourced. | Code read. | **Fixed.** |
| P1 | Comparison page said playit.gg is not open source and implied other unverified claims. | playit's agent repository is BSD-2-Clause (`github.com/playit-cloud/playit-agent`). | **Fixed:** table rebuilt from what the sources state; "Not checked" where unverified. |
| P1 | No central release data; download page had no version, date, size, requirements or checksum. | Code read. | **Fixed:** `src/release.js`. |
| P2 | Home page had no connection diagram and no real-screenshot workflow. | Code read. | **Added.** |
| P2 | Accessibility: low-contrast muted text (4.26 to 4.48:1), small tap targets on mobile footer links. | Lighthouse and a script over link sizes. | **Fixed** (Lighthouse accessibility 96 to 100 on the home page). |
| P2 | Video posters were 228 KB and 158 KB GIFs. | Lighthouse network list. | **Fixed:** WebP posters (29 KB and 15 KB). |

## Redirect investigation: `/download` to `voxelport.github.io/download/`

- **Live now:** `https://voxelport.in/download` returns **200 from Vercel**, with no redirect. `/download/` returns one 308 to `/download`. The `www` host does not resolve yet. The sitemap lists `https://voxelport.in/download`.
- **Repository:** no `github.io` string remains in `src`, `scripts`, `public` or `vercel.json` (the build fails if one appears). There is no React Router: routing is a small pathname check in `App.jsx`. `vercel.json` has only a `www`-to-apex redirect and the `/dl/*` rewrite.
- **Root cause (a legacy one):** until the DNS move, `voxelport.in` was served by the old server (`deploy/server/main.go`), which sent every path except `/dl/` and `/support.json` to `https://voxelport.github.io` with a **permanent (301)** redirect, and GitHub Pages then added the trailing slash (`/download/`). Permanent redirects are cached by browsers, crawlers and fetch tools for a long time, so a tool that visited before the cutover keeps reporting that path. That matches the reported URL exactly.
- **Today the old site is also gone:** `voxelport.github.io` returns 404 for every path (checked 2026-11-20), so the old target no longer exists.
- **Manual follow-up (backend, not changed here):** `deploy/server/main.go` still contains the github.io redirect. No public name reaches it any more (the apex moved; `dl-origin` is DNS-only and exempt). Update it to redirect to `https://voxelport.in` next time that server is deployed.

## Facts verified before being written on the site

| Fact | Source |
|---|---|
| Windows 2.0.0 stable, released 2026-11-18, installer 3,279,649 bytes, SHA-256 `1ea882d4…16dc` | GitHub release v2.0.0 assets and `SHA256SUMS.txt` |
| No current beta (2.0.0-beta.1/2 are old pre-releases) | GitHub releases list |
| Android 1.0.0 (versionCode 22), 54,638,754 bytes, SHA-256 `0b2197a8…801a`; needs Android 8.0 (API 26) | `voxelport.in/dl/android.json`; the Android app's `minSdk = 26`; the served APK hashed to the same value |
| Installer is not code-signed; SmartScreen warns, Smart App Control blocks | `VoxelPort-Tauri-Migration/docs/CODE_SIGNING.md` |
| playit.gg: free tier, "no port forwarding", Premium from $3/month, 21 supported games, agent BSD-2-Clause | `playit.gg`, `github.com/playit-cloud/playit-agent` |
| ngrok: Free, Hobbyist and pay-as-you-go plans; TCP on Free needs card verification | `ngrok.com/pricing` |
| App screens | Frames taken from the site's own recording `showcase/desktop.mp4` (a 2.0 pre-release build, sample server) |

## Not done, and why

- **Per-page "last updated" for release data** is set by hand in `src/release.js` (`VERIFIED_ON`). It must be edited when a release ships.
- **Windows release date for Android** is not stated: the update feed does not publish one.
- **New screenshots of the final 2.0 build** could not be taken here (Windows Smart App Control blocks running local builds on this PC). The existing recording is from a 2.0 pre-release and is labelled as such.
- **`www.voxelport.in`** has no DNS record yet (owner action).
- **The Discord invite** on the site (`discord.gg/JAUfmey2fP`) differs from the one in the maintainer's notes (`2wJbCPwP4r`). Not changed; please confirm which is current.
