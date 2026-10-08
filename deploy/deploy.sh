#!/usr/bin/env bash
# Build the site + static server locally and push them to the home server.
# Usage (from the website/ folder, Git Bash):  bash deploy/deploy.sh
set -euo pipefail

HOST="${DEPLOY_HOST:-trazhub@100.89.127.14}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/voxelport_vps}"
cd "$(dirname "$0")/.."

npm run build
(cd deploy/server && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o ../../voxelport-web-linux .)
tar -czf site.tgz -C dist .

scp -i "$KEY" -q site.tgz voxelport-web-linux deploy/voxelport-web.service "$HOST:/tmp/"
rm -f site.tgz voxelport-web-linux

# -t so sudo can prompt for the password.
ssh -t -i "$KEY" "$HOST" '
set -e
sudo mkdir -p /opt/voxelport-web/www.new
sudo tar -xzf /tmp/site.tgz -C /opt/voxelport-web/www.new
sudo rm -rf /opt/voxelport-web/www.old
[ -d /opt/voxelport-web/www ] && sudo mv /opt/voxelport-web/www /opt/voxelport-web/www.old
sudo mv /opt/voxelport-web/www.new /opt/voxelport-web/www
sudo install -m 0755 /tmp/voxelport-web-linux /opt/voxelport-web/voxelport-web
sudo install -m 0644 /tmp/voxelport-web.service /etc/systemd/system/voxelport-web.service
sudo chown -R root:root /opt/voxelport-web
rm -f /tmp/site.tgz /tmp/voxelport-web-linux /tmp/voxelport-web.service
sudo systemctl daemon-reload
sudo systemctl enable voxelport-web >/dev/null 2>&1
sudo systemctl restart voxelport-web
sleep 1
curl -s -o /dev/null -w "local check: HTTP %{http_code}\n" http://127.0.0.1:2527/
'
