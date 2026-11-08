#!/usr/bin/env bash
# Put the Android download on GitHub Pages: https://voxelport.github.io/dl/voxelport-android.apk and /dl/android.json
# Usage (from the website/ folder, Git Bash):  bash deploy/publish-android.sh
#
# It reads the live update feed (https://voxelport.in/dl/android.json, which the Android release already writes), downloads the APK that
# feed names, checks the size and SHA-256 the feed states, and only then puts both into the Pages repository under dl/. The feed's APK
# address is relative ("/dl/voxelport-android.apk?v=..."), so the same file works on either host.
#
# Why voxelport.in is still read: Android apps that are already installed only ever look at voxelport.in/dl for updates (they refuse
# any other host), so that is where a release is first published. This script copies it to the main site so the website's download button
# works there too. Run it after every Android release.
#
# The Pages repository is a build output: every publish is ONE new commit replacing the history (force-push), so old APKs never pile up.
set -euo pipefail

FEED="${ANDROID_FEED:-https://voxelport.in/dl/android.json}"
ORIGIN="${FEED%/dl/android.json}"
REPO="${PAGES_REPO:-https://github.com/VOXELPORT/voxelport.github.io.git}"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
curl -fsSL "$FEED" -o "$WORK/android.json"
read -r URL SHA SIZE < <(node -e "
const j = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
if (!/^\/dl\/voxelport-android\.apk(\?v=[0-9a-f]{8})?$/.test(j.url) || !/^[0-9a-f]{64}\$/.test(j.sha256) || !Number.isInteger(j.size)) { console.error('The feed is not in the expected shape.'); process.exit(1); }
console.log(j.url, j.sha256, j.size);
" "$WORK/android.json")

echo "Downloading ${ORIGIN}${URL} ..."
curl -fsSL "${ORIGIN}${URL}" -o "$WORK/voxelport-android.apk"
GOT_SIZE="$(wc -c < "$WORK/voxelport-android.apk" | tr -d ' ')"
GOT_SHA="$(node -e "const c=require('crypto'),f=require('fs');console.log(c.createHash('sha256').update(f.readFileSync(process.argv[1])).digest('hex'))" "$WORK/voxelport-android.apk")"
[ "$GOT_SIZE" = "$SIZE" ] || { echo "Size is $GOT_SIZE, the feed says $SIZE. Nothing was published." >&2; exit 1; }
[ "$GOT_SHA" = "$SHA" ] || { echo "SHA-256 is $GOT_SHA, the feed says $SHA. Nothing was published." >&2; exit 1; }
echo "Checked: $GOT_SIZE bytes, sha256 $GOT_SHA"

git clone --quiet --depth 1 "$REPO" "$WORK/pages"
mkdir -p "$WORK/pages/dl"
cp "$WORK/voxelport-android.apk" "$WORK/pages/dl/voxelport-android.apk"
cp "$WORK/android.json" "$WORK/pages/dl/android.json"
cd "$WORK/pages"
git checkout --quiet --orphan publish
git add -A
git -c core.autocrlf=false commit --quiet -m "Android download ($(date -u '+%Y-%m-%d %H:%M') UTC)"
git push --quiet --force origin HEAD:main
echo "Published. https://voxelport.github.io/dl/voxelport-android.apk updates within a minute or two."
