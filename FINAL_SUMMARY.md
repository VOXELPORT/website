# Final summary: website-final-fixes (2026-11-20)

Branch `website-final-fixes`, committed locally, **not pushed and not deployed**. Details: `AUDIT_REPORT.md`, `SEO_REPORT.md`, `CHANGELOG_WEBSITE.md`, `VERCEL_DEPLOYMENT.md`.

## What was wrong, in priority order

1. **P0 Android download links were dead** (a GitHub release URL that returns 404; the home page never linked the APK directly). Fixed; the live APK was downloaded and its SHA-256 matches the update feed.
2. **P0 Windows advice** told users to turn off Smart App Control. Replaced with an explanation of the warnings, a SHA-256 check and safer options.
3. **P0 `/download` "redirect to voxelport.github.io/download/"**: not reproducible. `https://voxelport.in/download` returns 200 from Vercel; the redirect was the old server's cached permanent redirect, and `voxelport.github.io` itself now returns 404 for every page. See `AUDIT_REPORT.md`.
4. **P1** metadata wording, unsourced comparison claims (including a wrong "playit.gg is not open source"), no release facts on the download page. Fixed.
5. **Mobile menu** drew underneath the hero text (your screenshot). Fixed and checked in a mobile-size browser.

## Test results (all run here)

| Check | Result |
|---|---|
| Clean `npm ci`, production build | passes |
| `npm run verify` (37 URLs: unique metadata, canonicals, JSON-LD, links, assets, banned wording, secrets) | ok, production and preview (noindex) |
| `npm test` | 8 passed, 0 failed |
| `npm run lint` | 10 errors, the same 10 as before this work (none in changed code) |
| Lighthouse, mobile preset, local production build, unthrottled-server, simulated slow 4G | Home: performance 78, accessibility 100, best practices 96, SEO 100 (before: 73 / 96 / 96 / 100). Download: 80 / 96 / 96 / 100 and Compare: 80 / 96 / 96 / 100 were measured before the contrast fix; not re-run. |
| Browser (desktop and phone size) | home, workflow, diagram, download, compare and open mobile menu render; no horizontal scroll at 375 px |
| Browser console | only the expected `/_vercel/...` script 404s on the local test server (those paths exist only on Vercel) |

Lighthouse numbers are lab results from this PC against a local server with no compression, so they understate Vercel. The home page's largest paint (4.6 s in the lab) is the headline, which stays hidden until the page's JavaScript runs; that was already by design and was not changed. Real-user numbers will come from Speed Insights after deploy.

## Preview and deploy (nothing has been run)

```bash
# local preview of the production build
npm ci && npm run build && npm run verify && npx vite preview

# preview deployment on Vercel (noindex)
git push -u origin website-final-fixes      # then open the preview URL in the Vercel dashboard

# production: merge to main
git checkout main && git merge website-final-fixes && git push
```

Roll back: Vercel dashboard, Deployments, previous deployment, Promote to Production.

## Remaining manual actions

1. Add the `www.voxelport.in` DNS record Vercel shows (it does not resolve yet).
2. Search Console: add `voxelport.in`, submit the sitemap, inspect the home page.
3. On the next release: edit `src/release.js` (version, date, size, SHA-256, `VERIFIED_ON`). That is the only place to edit.
4. Confirm the Discord invite (`JAUfmey2fP` on the site vs `2wJbCPwP4r` in your notes).
5. Optional backend cleanup: `deploy/server/main.go` still redirects to `voxelport.github.io`; point it at `https://voxelport.in` the next time that server is deployed.
6. When you have a screenshot of the final 2.0 build, replace the `public/showcase/app-*.webp` files (the current ones are from a 2.0 pre-release recording).
7. Windows code signing is not done (see `VoxelPort-Tauri-Migration/docs/CODE_SIGNING.md`); until then the warning text stays.
