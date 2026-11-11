# Website v2 — dark & bold redesign + app showcase

**Date:** 2026-11-11. **For:** the VoxelPort owner (garvverma900).

## Intent
The current site is a polished light-cream "v3". The owner wants a genuinely new **dark & bold**
look ("make v2") and a **showcase GIF of the app** on the site, for **both** desktop and Android,
captured from the **real apps**.

## What's decided
- **Direction:** dark & bold. Near-black background, big confident type, green accent (#3ddc84 /
  the existing grass green), the app showcase as the glowing centerpiece. Modern game/tech-product feel.
- **Showcase:** real captures, already done and in `public/showcase/`:
  - `desktop.mp4` / `.gif` — real Tauri app: empty home → server card → management screen →
    Online + live CPU/RAM/TPS → "SHARE THIS ADDRESS: play.voxelport.in:26137".
  - `android.mp4` / `.gif` — real Android build 20: Home/PLAY → Players/whitelist → Plugins.
  - Use `<video autoplay loop muted playsinline poster>` with the mp4 (smaller + crisper), GIF as
    the `<img>` fallback inside `<picture>`/noscript.
- **Scope:** home page first, shown to the owner before building out the rest. Keep ALL existing
  content/data/routes (content.js, data.js, seo.js, guides, FAQ, download, etc.) so nothing breaks.

## How
- New stylesheet `src/v2.css` is already taken; use `src/v2dark.css` for the new dark theme, scoped
  under a `.v2d` root class so it can't leak into other pages.
- Rebuild `Landing.jsx` around the showcase. Reuse `Nav`, `Footer`, `useDetectedOS`, the download
  links, `World`, and the FAQ/feature content already in the repo.
- Keep the move-strip (new-app notice), the proof ticker, the three feature cards, the platform
  download cards, community, FAQ.
- Accessibility: respect `prefers-reduced-motion` (pause the video), keep contrast AA on the dark bg.

## Non-goals
- No change to other pages yet (features/faq/download/guides keep working on their current CSS).
- No content rewrite; this is a visual redesign + the showcase.
