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

    const { domain, storeId, userId, years = 1 } = await req.json();
    if (!domain || !storeId) {
      return new Response(JSON.stringify({ error: "Missing domain or storeId" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const apiToken = Deno.env.get("CLOUDFLARE_API_TOKEN");
    const accountId = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");

    if (!apiToken || !accountId) {
      throw new Error("Cloudflare API credentials not configured");
    }

    // Register domain via Cloudflare Registrar
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/registrar/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: domain,
          auto_renew: true,
          years,
        }),
      },
    );

    const data = await response.json();

    const success = data.success === true;
    const orderId = data.result?.id || null;
    const error = data.errors?.[0]?.message || null;

    // Record in DB
    if (success) {
      const adminSupabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      await adminSupabase.from("domains").insert({
        domain_name: domain,
        domain_type: "purchased",
        status: "pending",
        store_id: storeId,
        user_id: userId || user.id,
        ssl_status: "pending",
      });
    }

    return new Response(
      JSON.stringify({ success, orderId, error }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[cloudflare-domain-purchase]", err);
    return new Response(
      JSON.stringify({ success: false, orderId: null, error: err.message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
