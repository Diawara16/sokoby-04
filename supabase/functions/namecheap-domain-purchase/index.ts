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

    // Registrant contact info from env (platform-level defaults)
    const params = new URLSearchParams({
      ApiUser: apiUser,
      ApiKey: apiKey,
      UserName: apiUser,
      ClientIp: clientIp,
      Command: "namecheap.domains.create",
      DomainName: domain,
      Years: String(years),
      // Registrant details (platform defaults)
      RegistrantFirstName: Deno.env.get("REGISTRANT_FIRST_NAME") || "Sokoby",
      RegistrantLastName: Deno.env.get("REGISTRANT_LAST_NAME") || "Platform",
      RegistrantAddress1: Deno.env.get("REGISTRANT_ADDRESS") || "123 Main St",
      RegistrantCity: Deno.env.get("REGISTRANT_CITY") || "Montreal",
      RegistrantStateProvince: Deno.env.get("REGISTRANT_STATE") || "QC",
      RegistrantPostalCode: Deno.env.get("REGISTRANT_POSTAL") || "H1A1A1",
      RegistrantCountry: Deno.env.get("REGISTRANT_COUNTRY") || "CA",
      RegistrantPhone: Deno.env.get("REGISTRANT_PHONE") || "+1.5141234567",
      RegistrantEmailAddress: Deno.env.get("REGISTRANT_EMAIL") || "domains@sokoby.com",
      // Tech/Admin/AuxBilling use same
      TechFirstName: Deno.env.get("REGISTRANT_FIRST_NAME") || "Sokoby",
      TechLastName: Deno.env.get("REGISTRANT_LAST_NAME") || "Platform",
      TechAddress1: Deno.env.get("REGISTRANT_ADDRESS") || "123 Main St",
      TechCity: Deno.env.get("REGISTRANT_CITY") || "Montreal",
      TechStateProvince: Deno.env.get("REGISTRANT_STATE") || "QC",
      TechPostalCode: Deno.env.get("REGISTRANT_POSTAL") || "H1A1A1",
      TechCountry: Deno.env.get("REGISTRANT_COUNTRY") || "CA",
      TechPhone: Deno.env.get("REGISTRANT_PHONE") || "+1.5141234567",
      TechEmailAddress: Deno.env.get("REGISTRANT_EMAIL") || "domains@sokoby.com",
      AdminFirstName: Deno.env.get("REGISTRANT_FIRST_NAME") || "Sokoby",
      AdminLastName: Deno.env.get("REGISTRANT_LAST_NAME") || "Platform",
      AdminAddress1: Deno.env.get("REGISTRANT_ADDRESS") || "123 Main St",
      AdminCity: Deno.env.get("REGISTRANT_CITY") || "Montreal",
      AdminStateProvince: Deno.env.get("REGISTRANT_STATE") || "QC",
      AdminPostalCode: Deno.env.get("REGISTRANT_POSTAL") || "H1A1A1",
      AdminCountry: Deno.env.get("REGISTRANT_COUNTRY") || "CA",
      AdminPhone: Deno.env.get("REGISTRANT_PHONE") || "+1.5141234567",
      AdminEmailAddress: Deno.env.get("REGISTRANT_EMAIL") || "domains@sokoby.com",
      AuxBillingFirstName: Deno.env.get("REGISTRANT_FIRST_NAME") || "Sokoby",
      AuxBillingLastName: Deno.env.get("REGISTRANT_LAST_NAME") || "Platform",
      AuxBillingAddress1: Deno.env.get("REGISTRANT_ADDRESS") || "123 Main St",
      AuxBillingCity: Deno.env.get("REGISTRANT_CITY") || "Montreal",
      AuxBillingStateProvince: Deno.env.get("REGISTRANT_STATE") || "QC",
      AuxBillingPostalCode: Deno.env.get("REGISTRANT_POSTAL") || "H1A1A1",
      AuxBillingCountry: Deno.env.get("REGISTRANT_COUNTRY") || "CA",
      AuxBillingPhone: Deno.env.get("REGISTRANT_PHONE") || "+1.5141234567",
      AuxBillingEmailAddress: Deno.env.get("REGISTRANT_EMAIL") || "domains@sokoby.com",
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const xmlText = await response.text();

    const successMatch = xmlText.match(/Status="(OK|ERROR)"/i);
    const orderIdMatch = xmlText.match(/OrderID="(\d+)"/i);
    const errorMatch = xmlText.match(/<Error[^>]*>(.*?)<\/Error>/i);

    const success = successMatch ? successMatch[1].toUpperCase() === "OK" : false;
    const orderId = orderIdMatch ? orderIdMatch[1] : null;
    const error = errorMatch ? errorMatch[1] : null;

    // Record in domain_orders using service role
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (success) {
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
    console.error("[namecheap-domain-purchase]", err);
    return new Response(
      JSON.stringify({ success: false, orderId: null, error: err.message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
