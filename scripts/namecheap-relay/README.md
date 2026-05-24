# Namecheap Static-IP Relay

Lightweight Node.js HTTPS reverse proxy that gives Supabase Edge Functions a
**deterministic outbound IP** for Namecheap API calls. Runs on the
DigitalOcean droplet at `64.227.10.144`.

## Why
Supabase Edge Functions egress from rotating GCP IPs. Namecheap rejects API
calls from non-whitelisted IPs. This relay sits between the edge function and
Namecheap so all traffic appears to come from the droplet's static IP.

## Deploy

On the droplet (as root):

```bash
# 1. Point an A-record (e.g. ncproxy.sokoby.com) at 64.227.10.144 and wait for DNS.

# 2. Generate a token and run the installer:
export RELAY_TOKEN="$(openssl rand -hex 32)"
export RELAY_DOMAIN="ncproxy.sokoby.com"

# 3. Copy server.js and install.sh to the droplet, then:
#    (install.sh expects __SERVER_JS__ to be replaced with the contents of server.js)
sed "/__SERVER_JS__/{r server.js
d
}" install.sh > install.real.sh
bash install.real.sh
```

After install, save `$RELAY_TOKEN` — you'll paste it into Supabase as
`NAMECHEAP_RELAY_TOKEN`.

## Verify

```bash
curl -i https://ncproxy.sokoby.com/health
# -> 200 ok

# Round-trip (sandbox availability check):
curl -i "https://ncproxy.sokoby.com/xml.response?upstream=api.sandbox.namecheap.com&ApiUser=...&ApiKey=...&UserName=...&ClientIp=64.227.10.144&Command=namecheap.domains.check&DomainList=example.com" \
  -H "Authorization: Bearer $RELAY_TOKEN"
```

## Security

- Bearer-token auth required on every request
- Upstream host whitelist: only `api.namecheap.com` and `api.sandbox.namecheap.com`
- `Authorization` header is stripped before forwarding upstream
- `ApiKey` query param is redacted in access logs
- TLS terminated by Caddy with automatic Let's Encrypt
- UFW restricts inbound to 22/80/443

## Rollback

In Supabase, **unset `NAMECHEAP_RELAY_URL`**. All four edge functions fall back
to direct fetch automatically (sandbox-only path; production calls will fail
until the secret is restored).
