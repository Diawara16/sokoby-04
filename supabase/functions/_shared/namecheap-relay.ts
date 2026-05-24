// Shared Namecheap transport.
// When NAMECHEAP_RELAY_URL is set, requests are routed through the static-IP
// relay (DigitalOcean droplet at 64.227.10.144) so Namecheap sees a whitelisted
// source IP. When unset, falls back to direct fetch (sandbox-only path).
//
// Contract with the relay (see scripts/namecheap-relay/server.js):
//   GET  {RELAY_URL}/health                          -> 200 "ok"
//   GET  {RELAY_URL}/xml.response?upstream=<host>&...-> proxies to https://<host>/xml.response?...
//   Header: Authorization: Bearer ${NAMECHEAP_RELAY_TOKEN}
// The relay strips Authorization before forwarding upstream and only allows
// upstream ∈ { api.namecheap.com, api.sandbox.namecheap.com }.

export function buildNamecheapRequest(
  params: Record<string, string>,
): { url: string; init: RequestInit } {
  const relayUrl = Deno.env.get("NAMECHEAP_RELAY_URL")?.replace(/\/+$/, "");
  const relayToken = Deno.env.get("NAMECHEAP_RELAY_TOKEN");
  const sandbox = (Deno.env.get("NAMECHEAP_SANDBOX") ?? "true").toLowerCase() !== "false";
  const upstreamHost = sandbox ? "api.sandbox.namecheap.com" : "api.namecheap.com";

  const qs = new URLSearchParams(params).toString();

  if (relayUrl) {
    const url = `${relayUrl}/xml.response?upstream=${upstreamHost}&${qs}`;
    return {
      url,
      init: {
        method: "GET",
        headers: relayToken ? { Authorization: `Bearer ${relayToken}` } : {},
      },
    };
  }

  // Fallback: direct fetch (egress IP is non-deterministic; sandbox-only).
  return {
    url: `https://${upstreamHost}/xml.response?${qs}`,
    init: { method: "GET" },
  };
}

export function isRelayConfigured(): boolean {
  return !!Deno.env.get("NAMECHEAP_RELAY_URL");
}
