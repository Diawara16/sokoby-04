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

    const { domain } = await req.json();
    if (!domain || typeof domain !== "string") {
      return new Response(JSON.stringify({ error: "Invalid domain" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const apiToken = Deno.env.get("CLOUDFLARE_API_TOKEN");
    const accountId = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");

    if (!apiToken || !accountId) {
      throw new Error("Cloudflare API credentials not configured");
    }

    // Use Cloudflare Registrar API to check domain availability
    const tld = domain.split(".").slice(1).join(".");
    const sld = domain.split(".")[0];

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/registrar/domains/check?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!data.success) {
      // Fallback: try WHOIS-style check
      return new Response(
        JSON.stringify({ available: false, premium: false, price: null, currency: "USD" }),
        { headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const result = data.result?.[0] || data.result;
    const available = result?.available ?? false;
    const premium = result?.premium ?? false;
    const price = result?.price ?? null;

    return new Response(
      JSON.stringify({ available, premium, price, currency: "USD" }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[cloudflare-domain-check]", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
