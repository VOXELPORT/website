# Final summary: production-verification (2026-11-20)

Branch `production-verification`, built on `main` (which is what voxelport.in serves). Committed locally; **not pushed, not deployed.** Evidence and per-issue detail: `PRODUCTION_AUDIT.md`. Other reports: `SEO_REPORT.md`, `VERCEL_DEPLOYMENT.md`, `CHANGELOG_WEBSITE.md`.

## 1. Problems found

Production matches the repository exactly (all 37 pages), every link resolves, and metadata, sitemap, robots and 404 behaviour are correct. The problems were in what the pages show:

1. **Failure states were drawn green** (relay down, DOWN pills, low-uptime bars, slow-route bar): the dark theme maps its "red" to green.
2. **A fabricated app dashboard on /features** (invented players and ping) with unreadable text.
3. **Status page wording over-claimed** ("Every relay is up", "Hosting still works", "DOWN" from one failed browser request) and kept stale counts after a failed refresh.
4. **Unqualified performance wording** ("low ping" in a title, "free forever", "in seconds", unmarked personal ping figures).
5. **Accessibility:** contrast failures on 5 routes, button names, heading order, and layout shift on /uptime (CLS 0.417) and /servers (0.12).

Re-verified and already fine: Windows security guidance, download page facts and links, comparison sources, status API and CORS.

## 2. Changes implemented

See `CHANGELOG_WEBSITE.md`. New tooling: `scripts/audit-live.mjs`, more `npm run verify` guards.

## 3. Files modified

`src/StatusPage.jsx`, `src/UptimePage.jsx`, `src/ServersPage.jsx`, `src/MorePages.jsx`, `src/MotdPage.jsx`, `src/LegalPage.jsx`, `src/v2inner.css`, `src/guides.js`, `src/guides-meta.js`, `src/about.js`, `src/content.js`, `scripts/verify-build.mjs`; new `scripts/audit-live.mjs`; reports `PRODUCTION_AUDIT.md`, `SEO_REPORT.md`, `CHANGELOG_WEBSITE.md`, `FINAL_SUMMARY.md`.

## 4. Tests executed and 5. results (all actually run)

| Check | Result |
|---|---|
| Clean `npm ci` and production build | pass |
| `npm run verify` (37 URLs, links, assets, metadata, JSON-LD, secrets, banned wording) | ok (production); ok earlier for preview-mode build (noindex) |
| `npm test` | 8 passed, 0 failed |
| `npm run lint` | 10 errors, identical to the 10 before any of this work (none in changed code) |
| Type checking | not applicable (plain JavaScript project, no TypeScript) |
| `audit-live.mjs` against production, with external links | ok: 37 pages, 48 internal and 19 external links |
| Lighthouse 12, mobile preset, local production build, all 15 routes | accessibility 100 on every route (was 94 to 96 on five); SEO 100; best practices 96; performance 78 to 81 (uptime was 62); CLS 0 on all but status 0.024, servers 0.099, home 0.044 |
| Browser at 375 px: home, status (live and failure states), uptime, download, compare, a guide, mobile menu | no horizontal scroll; failure state red and readable |
| Browser console | only the expected 404s for `/_vercel/*` scripts, which exist only on Vercel |
| Status API CORS and live data | pass (all four endpoints, `access-control-allow-origin: *`) |

Lighthouse numbers are lab results on this PC against an uncompressed local server, so they understate Vercel; the home page's largest paint (about 4.6 s in the lab) is the headline waiting for JavaScript, unchanged by design. No claim is made about real-user speed until Speed Insights has data.

Not tested: a real Windows 11 machine with Smart App Control, and Google's Rich Results / Search Console tools (not available here).

## 6. Remaining blockers

None for deploying these fixes.

## 7. Manual actions required

1. Add the `www.voxelport.in` DNS record Vercel shows (does not resolve yet).
2. Search Console: add the property, submit the sitemap, inspect the home page.
3. Align the Tauri app's README (it still mentions Run anyway and switching Smart App Control off) and the Discord bot's FAQ; both are outside this repository.
4. On each release, edit `src/release.js` only.
5. Optional: `deploy/server/main.go` on the old server still redirects to the retired `voxelport.github.io`.

## 8. Deployment readiness verdict

**Ready to deploy**, after your approval. Verify locally:

```bash
npm ci && npm run build && npm run verify && npm test
node scripts/audit-live.mjs https://voxelport.in --external   # compares production with this build
npx vite preview                                              # then open the pages
```

Deploy (not run): `git push -u origin production-verification` for a noindex preview; then merge to `main` for production. Roll back from the Vercel dashboard (Deployments, previous deployment, Promote to Production).
