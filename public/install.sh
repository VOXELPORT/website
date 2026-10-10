#!/bin/sh
# VoxelPort CLI installer: curl -fsSL https://voxelport.in/install.sh | sh
#
# Downloads the latest release for this machine from GitHub, checks its
# SHA-256, and puts `voxelport` in /usr/local/bin (or ~/.local/bin without
# root). Set VOXELPORT_VERSION=v0.1.0 to pin a version, or
# VOXELPORT_INSTALL_DIR to choose where it goes.
set -eu

REPO="VOXELPORT/cli"
VERSION="${VOXELPORT_VERSION:-latest}"

say() { printf '%s\n' "$*"; }
fail() { printf 'Error: %s\n' "$*" >&2; exit 1; }

os=$(uname -s)
case "$os" in
  Linux) os=linux ;;
  Darwin) os=darwin ;;
  *) fail "this installer supports Linux and macOS. On Windows, get the VoxelPort app from the Microsoft Store." ;;
esac
arch=$(uname -m)
case "$arch" in
  x86_64|amd64) arch=amd64 ;;
  aarch64|arm64) arch=arm64 ;;
  armv7l|armv7*|armv6l) arch=armv7 ;;
  *) fail "unsupported CPU architecture: $arch" ;;
esac

if command -v curl >/dev/null 2>&1; then
  fetch() { curl -fsSL "$1" -o "$2"; }
elif command -v wget >/dev/null 2>&1; then
  fetch() { wget -qO "$2" "$1"; }
else
  fail "curl or wget is required"
fi

if [ "$VERSION" = "latest" ]; then
  base="https://github.com/$REPO/releases/latest/download"
else
  base="https://github.com/$REPO/releases/download/$VERSION"
fi
file="voxelport-$os-$arch.tar.gz"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT INT TERM

say "Downloading $file…"
fetch "$base/$file" "$tmp/$file" || fail "download failed ($base/$file)"
fetch "$base/SHA256SUMS" "$tmp/SHA256SUMS" || fail "couldn't download checksums"

want=$(grep " $file\$" "$tmp/SHA256SUMS" | cut -d' ' -f1)
[ -n "$want" ] || fail "no checksum listed for $file"
if command -v sha256sum >/dev/null 2>&1; then
  got=$(sha256sum "$tmp/$file" | cut -d' ' -f1)
else
  got=$(shasum -a 256 "$tmp/$file" | cut -d' ' -f1)
fi
[ "$want" = "$got" ] || fail "checksum mismatch: the download is corrupt or was tampered with"

tar -xzf "$tmp/$file" -C "$tmp"

dir="${VOXELPORT_INSTALL_DIR:-}"
if [ -z "$dir" ]; then
  if [ "$(id -u)" = "0" ] || [ -w /usr/local/bin ]; then
    dir=/usr/local/bin
  elif command -v sudo >/dev/null 2>&1 && say "Installing to /usr/local/bin (may ask for your password)…" &&
       sudo install -m 0755 "$tmp/voxelport" /usr/local/bin/voxelport; then
    dir=/usr/local/bin
  else
    say "Couldn't use sudo; installing for your user only."
    dir="$HOME/.local/bin"
  fi
fi
if [ ! -x "$dir/voxelport" ] || ! cmp -s "$tmp/voxelport" "$dir/voxelport"; then
  mkdir -p "$dir"
  install -m 0755 "$tmp/voxelport" "$dir/voxelport" 2>/dev/null || cp "$tmp/voxelport" "$dir/voxelport"
fi

say ""
say "Installed: $("$dir/voxelport" version) → $dir/voxelport"
case ":$PATH:" in
  *":$dir:"*) ;;
  *) say "Add $dir to your PATH, e.g.:  export PATH=\"$dir:\$PATH\"" ;;
esac
say ""
say "Share a Minecraft server on port 25565:   voxelport up"
say "Start it at boot:                          voxelport service install"
say "Help:                                      voxelport help"
