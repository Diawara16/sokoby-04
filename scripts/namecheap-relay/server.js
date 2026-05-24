/**
 * Namecheap static-IP relay.
 * Runs on the DigitalOcean droplet (64.227.10.144) so all Namecheap API
 * traffic originates from a whitelisted IP.
 *
 * Endpoints:
 *   GET /health                              -> 200 "ok"
 *   GET /xml.response?upstream=<host>&...    -> proxies to https://<host>/xml.response?...
 *
 * Security:
 *   - Requires header `Authorization: Bearer ${RELAY_TOKEN}`
 *   - Upstream host whitelist (SSRF protection)
 *   - Strips Authorization before forwarding upstream
 *   - Redacts ApiKey from access logs
 *
 * Env:
 *   RELAY_TOKEN   shared secret (matches Supabase NAMECHEAP_RELAY_TOKEN)
 *   PORT          default 8080 (run behind Caddy/nginx for TLS)
 */
const http = require("http");
const https = require("https");
const { URL } = require("url");

const PORT = parseInt(process.env.PORT || "8080", 10);
const TOKEN = process.env.RELAY_TOKEN;
const ALLOWED_UPSTREAM = new Set([
  "api.namecheap.com",
  "api.sandbox.namecheap.com",
]);

if (!TOKEN) {
  console.error("FATAL: RELAY_TOKEN env var required");
  process.exit(1);
}

function redact(qs) {
  return qs.replace(/(ApiKey=)[^&]+/gi, "$1***");
}

const server = http.createServer((req, res) => {
  const started = Date.now();
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (reqUrl.pathname === "/health") {
    res.writeHead(200, { "content-type": "text/plain" });
    return res.end("ok");
  }

  if (reqUrl.pathname !== "/xml.response") {
    res.writeHead(404);
    return res.end("not found");
  }

  // Auth
  const auth = req.headers["authorization"] || "";
  if (auth !== `Bearer ${TOKEN}`) {
    res.writeHead(401, { "content-type": "text/plain" });
    return res.end("unauthorized");
  }

  // Upstream whitelist
  const upstream = reqUrl.searchParams.get("upstream");
  if (!upstream || !ALLOWED_UPSTREAM.has(upstream)) {
    res.writeHead(400, { "content-type": "text/plain" });
    return res.end("invalid upstream");
  }

  // Build upstream query (drop our `upstream` param)
  reqUrl.searchParams.delete("upstream");
  const upstreamPath = `/xml.response?${reqUrl.searchParams.toString()}`;

  const proxyReq = https.request(
    {
      host: upstream,
      port: 443,
      path: upstreamPath,
      method: req.method,
      headers: {
        host: upstream,
        accept: "application/xml,text/xml,*/*",
        "user-agent": "sokoby-namecheap-relay/1.0",
        // NOTE: Authorization intentionally NOT forwarded
      },
      timeout: 25_000,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
      proxyRes.on("end", () => {
        const ms = Date.now() - started;
        console.log(
          `[relay] ${proxyRes.statusCode} ${upstream} ${ms}ms ?${redact(reqUrl.searchParams.toString())}`,
        );
      });
    },
  );

  proxyReq.on("timeout", () => {
    proxyReq.destroy(new Error("upstream timeout"));
  });
  proxyReq.on("error", (err) => {
    console.error("[relay] upstream error", err.message);
    if (!res.headersSent) res.writeHead(502, { "content-type": "text/plain" });
    res.end(`upstream error: ${err.message}`);
  });
  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`[relay] listening on :${PORT} (upstreams: ${[...ALLOWED_UPSTREAM].join(", ")})`);
});
