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

    const apiToken = Deno.env.get("CLOUDFLARE_API_TOKEN");
    const accountId = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");

    if (!apiToken || !accountId) {
      throw new Error("Cloudflare API credentials not configured");
    }

    const headers = {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    };

    // 1. Get the zone ID for this domain
    const zoneRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(domain)}&account.id=${accountId}`,
      { headers },
    );
    const zoneData = await zoneRes.json();
    const zoneId = zoneData.result?.[0]?.id;

    if (!zoneId) {
      // Zone may not exist yet — create it
      const createZoneRes = await fetch(
        "https://api.cloudflare.com/client/v4/zones",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: domain,
            account: { id: accountId },
            type: "full",
          }),
        },
      );
      const createZoneData = await createZoneRes.json();
      if (!createZoneData.success) {
        return new Response(
          JSON.stringify({ success: false, error: "Failed to create zone" }),
          { headers: { ...CORS, "Content-Type": "application/json" } },
        );
      }
      var activeZoneId = createZoneData.result.id;
    } else {
      var activeZoneId = zoneId;
    }

    // 2. Create DNS records
    let allSuccess = true;
    for (const record of records) {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${activeZoneId}/dns_records`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            type: record.type,
            name: record.host === "@" ? domain : `${record.host}.${domain}`,
            content: record.value,
            ttl: record.ttl || 1,
            proxied: record.type === "A" || record.type === "CNAME",
          }),
        },
      );
      const resData = await res.json();
      if (!resData.success) {
        console.error("[cloudflare-dns] Record failed:", record, resData.errors);
        allSuccess = false;
      }
    }

    return new Response(
      JSON.stringify({ success: allSuccess }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[cloudflare-dns-configure]", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
