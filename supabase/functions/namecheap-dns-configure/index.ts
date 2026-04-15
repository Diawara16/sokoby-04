const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("AUTH_REQUIRED");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("AUTH_REQUIRED");

    const { domain, records } = await req.json();
    if (!domain || !Array.isArray(records)) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const apiUser = Deno.env.get("NAMECHEAP_API_USER");
    const apiKey = Deno.env.get("NAMECHEAP_API_KEY");
    const clientIp = Deno.env.get("NAMECHEAP_CLIENT_IP") || "0.0.0.0";
    const sandbox = Deno.env.get("NAMECHEAP_SANDBOX") === "true";

    if (!apiUser || !apiKey) {
      throw new Error("Namecheap API credentials not configured");
    }

    const baseUrl = sandbox
      ? "https://api.sandbox.namecheap.com/xml.response"
      : "https://api.namecheap.com/xml.response";

    const parts = domain.split(".");
    const tld = parts.slice(1).join(".");
    const sld = parts[0];

    const params = new URLSearchParams({
      ApiUser: apiUser,
      ApiKey: apiKey,
      UserName: apiUser,
      ClientIp: clientIp,
      Command: "namecheap.domains.dns.setHosts",
      SLD: sld,
      TLD: tld,
    });

    // Add DNS records
    records.forEach((record: { type: string; host: string; value: string; ttl: number }, i: number) => {
      const idx = i + 1;
      params.set(`HostName${idx}`, record.host);
      params.set(`RecordType${idx}`, record.type);
      params.set(`Address${idx}`, record.value);
      params.set(`TTL${idx}`, String(record.ttl || 1800));
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const xmlText = await response.text();

    const successMatch = xmlText.match(/Status="(OK|ERROR)"/i);
    const success = successMatch ? successMatch[1].toUpperCase() === "OK" : false;

    return new Response(
      JSON.stringify({ success }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[namecheap-dns-configure]", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
