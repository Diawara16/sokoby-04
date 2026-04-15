import { corsHeaders } from "https://deno.land/x/cors_headers@v0.1.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    // Auth check
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

    // Extract SLD and TLD
    const parts = domain.split(".");
    const tld = parts.slice(1).join(".");
    const sld = parts[0];

    const params = new URLSearchParams({
      ApiUser: apiUser,
      ApiKey: apiKey,
      UserName: apiUser,
      ClientIp: clientIp,
      Command: "namecheap.domains.check",
      DomainList: domain,
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const xmlText = await response.text();

    // Parse XML response
    const availableMatch = xmlText.match(/Available="(true|false)"/i);
    const premiumMatch = xmlText.match(/IsPremiumName="(true|false)"/i);
    const priceMatch = xmlText.match(/PremiumRegistrationPrice="([^"]+)"/i);

    const available = availableMatch ? availableMatch[1].toLowerCase() === "true" : false;
    const premium = premiumMatch ? premiumMatch[1].toLowerCase() === "true" : false;
    const price = priceMatch ? parseFloat(priceMatch[1]) : null;

    return new Response(
      JSON.stringify({ available, premium, price, currency: "USD" }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[namecheap-domain-check]", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
