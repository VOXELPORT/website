#!/usr/bin/env bash
# Publish the built site to GitHub Pages: https://voxelport.github.io (the main website).
# Usage (from the website/ folder, Git Bash):  bash deploy/publish-pages.sh
#
# It builds the site, clones the Pages repository (VOXELPORT/voxelport.github.io) into a temporary folder, replaces its
# files with the build, and pushes. GitHub Pages then serves it within a minute or two. Uses the Git sign-in you already have.
#
# The live copy on the old server (deploy/deploy.sh) is separate: voxelport.in still serves the Android downloads under /dl/.
set -euo pipefail

REPO="${PAGES_REPO:-https://github.com/VOXELPORT/voxelport.github.io.git}"
cd "$(dirname "$0")/.."

npm run build

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
git clone --quiet --depth 1 "$REPO" "$WORK/pages"

# Replace everything except the git folder with the new build.
find "$WORK/pages" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r dist/. "$WORK/pages/"
cp "$WORK/pages/index.html" "$WORK/pages/404.html"   # unknown addresses get the app shell (Pages answers them with a 404 status)
touch "$WORK/pages/.nojekyll"                          # serve every file as it is
cat > "$WORK/pages/README.md" <<'EOF'
# voxelport.github.io

The VoxelPort website: https://voxelport.github.io

This repository holds only the built pages; there is nothing to edit here. The site is rebuilt and published from the website project (`deploy/publish-pages.sh`).

VoxelPort lets you host a Minecraft server from your PC or your Android phone and share it with friends without port forwarding. Downloads and the Discord invite are on the site.
EOF

cd "$WORK/pages"
git add -A
if git diff --cached --quiet; then
  echo "Nothing changed: the site on GitHub Pages is already up to date."
  exit 0
fi
git commit --quiet -m "Publish the website ($(date -u +%Y-%m-%d\ %H:%M) UTC)"
git push --quiet origin HEAD:main
echo "Published. https://voxelport.github.io updates within a minute or two."
