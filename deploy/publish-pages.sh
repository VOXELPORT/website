#!/usr/bin/env bash
# Publish the built site to GitHub Pages: https://voxelport.github.io (the main website).
# Usage (from the website/ folder, Git Bash):  bash deploy/publish-pages.sh
#
# It builds the site, clones the Pages repository (VOXELPORT/voxelport.github.io) into a temporary folder, replaces its
# files with the build, and pushes. GitHub Pages then serves it within a minute or two. Uses the Git sign-in you already have.
#
# The Pages repository also holds the Android download under dl/ (the APK and its update feed, see deploy/publish-android.sh).
# This script leaves dl/ exactly as it is. The repository is a build output: every publish is ONE new commit that replaces the
# history (force-push), so the 55 MB APK of old versions never piles up in it.
#
# The live copy on the old server (deploy/deploy.sh) is separate: voxelport.in still serves the same files, and installed Android
# apps still update from voxelport.in/dl.
set -euo pipefail

REPO="${PAGES_REPO:-https://github.com/VOXELPORT/voxelport.github.io.git}"
cd "$(dirname "$0")/.."

npm run build

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
git clone --quiet --depth 1 "$REPO" "$WORK/pages"

# Replace everything except the git folder and the downloads with the new build.
find "$WORK/pages" -mindepth 1 -maxdepth 1 ! -name .git ! -name dl -exec rm -rf {} +
cp -r dist/. "$WORK/pages/"
cp "$WORK/pages/index.html" "$WORK/pages/404.html"   # unknown addresses get the app shell (Pages answers them with a 404 status)
touch "$WORK/pages/.nojekyll"                          # serve every file as it is
cat > "$WORK/pages/README.md" <<'EOF'
# voxelport.github.io

The VoxelPort website: https://voxelport.github.io

This repository holds only built files; there is nothing to edit here. The site is rebuilt and published from the website project (`deploy/publish-pages.sh`), and the Android download in `dl/` from `deploy/publish-android.sh`.

VoxelPort lets you host a Minecraft server from your PC or your Android phone and share it with friends without port forwarding. Downloads and the Discord invite are on the site.
EOF

cd "$WORK/pages"
git checkout --quiet --orphan publish
git add -A
git -c core.autocrlf=false commit --quiet -m "Publish the website ($(date -u '+%Y-%m-%d %H:%M') UTC)"
git push --quiet --force origin HEAD:main
echo "Published. https://voxelport.github.io updates within a minute or two."
