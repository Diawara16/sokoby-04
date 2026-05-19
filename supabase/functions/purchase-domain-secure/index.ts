// purchase-domain-secure
// Completes a pending domain reservation by calling Namecheap securely.
// Sandbox-first: defaults to Namecheap sandbox unless NAMECHEAP_SANDBOX="false".
// Never exposes credentials to the client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TIMEOUT_MS = 25_000;

type PurchaseResult = {
  success: boolean;
  status: "purchased" | "failed";
  orderId: string | null;
  error: string | null;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function callNamecheap(domain: string, years: number): Promise<PurchaseResult> {
  const apiUser = Deno.env.get("NAMECHEAP_API_USER");
  const apiKey = Deno.env.get("NAMECHEAP_API_KEY");
  const userName = Deno.env.get("NAMECHEAP_USERNAME") || apiUser;
  const clientIp = Deno.env.get("NAMECHEAP_CLIENT_IP") || "0.0.0.0";
  // Default to sandbox for safety. Production requires explicit opt-in.
  const sandbox = (Deno.env.get("NAMECHEAP_SANDBOX") ?? "true").toLowerCase() !== "false";

  if (!apiUser || !apiKey || !userName) {
    return { success: false, status: "failed", orderId: null, error: "Namecheap credentials not configured" };
  }

  const baseUrl = sandbox
    ? "https://api.sandbox.namecheap.com/xml.response"
    : "https://api.namecheap.com/xml.response";

  const registrant = {
    FirstName: Deno.env.get("REGISTRANT_FIRST_NAME") || "Sokoby",
    LastName: Deno.env.get("REGISTRANT_LAST_NAME") || "Platform",
    Address1: Deno.env.get("REGISTRANT_ADDRESS") || "123 Main St",
    City: Deno.env.get("REGISTRANT_CITY") || "Montreal",
    StateProvince: Deno.env.get("REGISTRANT_STATE") || "QC",
    PostalCode: Deno.env.get("REGISTRANT_POSTAL") || "H1A1A1",
    Country: Deno.env.get("REGISTRANT_COUNTRY") || "CA",
    Phone: Deno.env.get("REGISTRANT_PHONE") || "+1.5141234567",
    EmailAddress: Deno.env.get("REGISTRANT_EMAIL") || "domains@sokoby.com",
  };

  const params: Record<string, string> = {
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: userName,
    ClientIp: clientIp,
    Command: "namecheap.domains.create",
    DomainName: domain,
    Years: String(years),
  };
  for (const role of ["Registrant", "Tech", "Admin", "AuxBilling"]) {
    for (const [k, v] of Object.entries(registrant)) {
      params[`${role}${k}`] = v;
    }
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl}?${new URLSearchParams(params)}`, { signal: ctrl.signal });
    const xml = await res.text();

    const statusMatch = xml.match(/Status="(OK|ERROR)"/i);
    const orderId = xml.match(/OrderID="(\d+)"/i)?.[1] ?? null;
    const errorMsg = xml.match(/<Error[^>]*>([^<]+)<\/Error>/i)?.[1] ?? null;
    const ok = statusMatch?.[1]?.toUpperCase() === "OK" && !errorMsg;

    if (ok) {
      return { success: true, status: "purchased", orderId, error: null };
    }
    return {
      success: false,
      status: "failed",
      orderId,
      error: errorMsg || `Namecheap returned non-OK status (sandbox=${sandbox})`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { success: false, status: "failed", orderId: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "AUTH_REQUIRED" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return json({ error: "AUTH_REQUIRED" }, 401);

    const body = await req.json().catch(() => ({}));
    const domainId: string | undefined = body.domainId;
    const years = Math.min(Math.max(Number(body.years) || 1, 1), 10);

    if (!domainId || typeof domainId !== "string") {
      return json({ error: "domainId required" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify ownership + load row.
    const { data: row, error: loadErr } = await admin
      .from("store_domains")
      .select("id, user_id, domain, status, provider")
      .eq("id", domainId)
      .maybeSingle();

    if (loadErr) return json({ error: loadErr.message }, 500);
    if (!row) return json({ error: "Domain reservation not found" }, 404);
    if (row.user_id !== user.id) return json({ error: "FORBIDDEN" }, 403);
    if (!row.domain) return json({ error: "Invalid reservation" }, 400);

    // Duplicate-purchase protection.
    if (row.status === "purchased" || row.status === "active") {
      return json({ success: true, status: row.status, orderId: null, alreadyPurchased: true });
    }
    if (row.status === "purchasing") {
      return json({ error: "Purchase already in progress" }, 409);
    }

    // Transition: pending -> purchasing (guarded).
    const { data: locked, error: lockErr } = await admin
      .from("store_domains")
      .update({ status: "purchasing", dns_setup_error: null })
      .eq("id", domainId)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (lockErr) return json({ error: lockErr.message }, 500);
    if (!locked) return json({ error: "Reservation no longer pending" }, 409);

    console.log(`[purchase-domain-secure] user=${user.id} domain=${row.domain} years=${years}`);

    const result = await callNamecheap(row.domain, years);

    const update: Record<string, unknown> = {
      status: result.status,
      provider: "namecheap",
    };
    if (result.success) {
      update.provider_order_id = result.orderId;
      update.dns_setup_error = null;
    } else {
      update.dns_setup_error = result.error;
    }

    const { error: updErr } = await admin
      .from("store_domains")
      .update(update)
      .eq("id", domainId);
    if (updErr) console.error("[purchase-domain-secure] update error", updErr);

    return json(result, result.success ? 200 : 502);
  } catch (e) {
    console.error("[purchase-domain-secure] fatal", e);
    const msg = e instanceof Error ? e.message : "Internal error";
    return json({ error: msg }, 500);
  }
});
