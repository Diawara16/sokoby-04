#!/usr/bin/env bash
# Install the Namecheap relay on the DigitalOcean droplet (Ubuntu 22.04+).
# Run as root on 64.227.10.144.
#
# Usage:
#   export RELAY_TOKEN="$(openssl rand -hex 32)"   # save this; you'll paste it into Supabase
#   export RELAY_DOMAIN="ncproxy.sokoby.com"       # must point A-record -> 64.227.10.144
#   bash install.sh
#
# Produces:
#   - /opt/namecheap-relay/server.js  (the Node app)
#   - systemd service: namecheap-relay (listens on 127.0.0.1:8080)
#   - Caddy reverse proxy on :443 with automatic Let's Encrypt TLS
#   - UFW: only 22, 80, 443 open
set -euo pipefail

: "${RELAY_TOKEN:?RELAY_TOKEN env var required}"
: "${RELAY_DOMAIN:?RELAY_DOMAIN env var required (e.g. ncproxy.sokoby.com)}"

echo "[1/6] Installing prerequisites..."
apt-get update -y
apt-get install -y curl ufw debian-keyring debian-archive-keyring apt-transport-https
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
  apt-get install -y caddy
fi

echo "[2/6] Deploying relay app..."
mkdir -p /opt/namecheap-relay
cat > /opt/namecheap-relay/server.js <<'SERVER_EOF'
__SERVER_JS__
SERVER_EOF

echo "[3/6] Creating systemd unit..."
cat > /etc/systemd/system/namecheap-relay.service <<EOF
[Unit]
Description=Namecheap static-IP relay
After=network.target

[Service]
Environment=PORT=8080
Environment=RELAY_TOKEN=${RELAY_TOKEN}
ExecStart=/usr/bin/node /opt/namecheap-relay/server.js
Restart=always
RestartSec=3
User=www-data
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now namecheap-relay

echo "[4/6] Configuring Caddy (TLS via Let's Encrypt)..."
cat > /etc/caddy/Caddyfile <<EOF
${RELAY_DOMAIN} {
    encode gzip
    reverse_proxy 127.0.0.1:8080
    log {
        output file /var/log/caddy/namecheap-relay.log
        format json
    }
}
EOF
systemctl reload caddy

echo "[5/6] Firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "[6/6] Smoke test..."
sleep 3
curl -sS "https://${RELAY_DOMAIN}/health" && echo
echo
echo "DONE."
echo "  Relay URL:   https://${RELAY_DOMAIN}"
echo "  Health:      https://${RELAY_DOMAIN}/health"
echo "  Token:       (saved in systemd unit; rotate with: systemctl edit namecheap-relay)"
echo
echo "Next: in Supabase, set secrets"
echo "  NAMECHEAP_RELAY_URL   = https://${RELAY_DOMAIN}"
echo "  NAMECHEAP_RELAY_TOKEN = ${RELAY_TOKEN}"
echo "  NAMECHEAP_CLIENT_IP   = 64.227.10.144"
