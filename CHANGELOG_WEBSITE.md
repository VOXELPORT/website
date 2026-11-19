# Website changelog

## website-final-fixes (2026-11-20, not deployed)

### Fixed
- **Mobile menu overlapped the page.** The open menu was painted underneath the hero text because the header's stacking level was lowered by an older rule. The header is sticky and above the page again, and the open menu is a solid panel that scrolls if it is taller than the screen. (`src/v2dark.css`)
- **Android download links.** All Android buttons (home hero on Android, home Android card, download page, static text, `llms.txt`) point at the real APK, `https://voxelport.in/dl/voxelport-android.apk`. The dead GitHub release link is gone. (`src/data.js`, `src/Landing.jsx`, `src/MorePages.jsx`, `scripts/prerender.mjs`)
- **Windows guidance** no longer tells people to turn off Smart App Control. One shared text explains the warnings and the SHA-256 check. (`src/release.js` and its users)
- **Download page sticker** no longer says "previous app v2.0.0".
- **Contrast and tap targets** on the dark pages; WebP posters instead of GIFs.

### Added
- **Home page:** headline "Your Minecraft Server. Your Control.", the requested description, "Download VoxelPort" and "Explore Features" buttons, a five-step workflow with real app screenshots, a connection diagram (semantic list, no images, works on phones), and a "not a hosting service" note.
- **`src/release.js`:** one place for versions, dates, sizes, checksums and requirements, plus the Windows-warning wording.
- **Download page:** release table (stable version, release date, file and size, requirements, SHA-256, links), live Android values from `/dl/android.json`, and a "Check the download" section.
- **Comparison page:** sourced and dated comparison with definitions and limits.
- **Screenshots:** `public/showcase/app-*.webp` (five frames from the real recording) and `android-poster.webp`.
- **`npm run verify` guards:** banned wording, the dead Android link, required download facts.

### Changed
- Titles and descriptions for Home, Features, Download, Guides index and About, as requested. Comparison wording rewritten from the sources (playit.gg is no longer described as closed source).
- `tests/discordWording.test.mjs`: the check now looks for "join our Discord server" instead of the old "hosts join" phrase.

### Removed
- "MACOS · SOON" button on the download page (macOS and Linux are not available; the page says so).
- The "switch Smart App Control off" instructions everywhere.
- Unverified comparison cells ("Open source: NO" for playit.gg, "Freemium" for players, "Hides your home IP: YES" for ngrok).

### Earlier on `main` (already live)
Vercel migration, canonical domain, real 404s, preview noindex, security headers, `/dl/` proxy, Analytics and Speed Insights, first positioning pass.
