// purchase-domain-secure
// Completes a pending domain reservation by calling Namecheap securely.
// Sandbox-first: defaults to Namecheap sandbox unless NAMECHEAP_SANDBOX="false".
// Operates EXCLUSIVELY on public.domain_purchases.
// Never reads from or writes to public.store_domains (DNS lifecycle isolation).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildNamecheapRequest } from "../_shared/namecheap-relay.ts";

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
  const sandbox = (Deno.env.get("NAMECHEAP_SANDBOX") ?? "true").toLowerCase() !== "false";

  if (!apiUser || !apiKey || !userName) {
    return { success: false, status: "failed", orderId: null, error: "Namecheap credentials not configured" };
  }

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
    const { url, init } = buildNamecheapRequest(params);
    const res = await fetch(url, { ...init, signal: ctrl.signal });
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
    // Accept either purchaseId (preferred) or legacy domainId param.
    const purchaseId: string | undefined = body.purchaseId ?? body.domainId;
    const years = Math.min(Math.max(Number(body.years) || 1, 1), 10);

    if (!purchaseId || typeof purchaseId !== "string") {
      return json({ error: "purchaseId required" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Load reservation from domain_purchases (single source of truth).
    const { data: row, error: loadErr } = await admin
      .from("domain_purchases")
      .select("id, user_id, domain_name, status, provider")
      .eq("id", purchaseId)
      .maybeSingle();

    if (loadErr) return json({ error: loadErr.message }, 500);
    if (!row) return json({ error: "Purchase reservation not found" }, 404);
    if (row.user_id !== user.id) return json({ error: "FORBIDDEN" }, 403);
    if (!row.domain_name) return json({ error: "Invalid reservation" }, 400);

    // Duplicate-purchase protection.
    if (row.status === "purchased") {
      return json({ success: true, status: "purchased", orderId: null, alreadyPurchased: true });
    }
    if (row.status === "purchasing") {
      return json({ error: "Purchase already in progress" }, 409);
    }

    // Transition: pending|failed -> purchasing (guarded, atomic).
    const { data: locked, error: lockErr } = await admin
      .from("domain_purchases")
      .update({ status: "purchasing", error_message: null, years })
      .eq("id", purchaseId)
      .in("status", ["pending", "failed"])
      .select("id")
      .maybeSingle();

    if (lockErr) return json({ error: lockErr.message }, 500);
    if (!locked) return json({ error: "Reservation not in a state that can be purchased" }, 409);

    console.log(`[purchase-domain-secure] user=${user.id} domain=${row.domain_name} years=${years}`);

    const result = await callNamecheap(row.domain_name, years);

    const update: Record<string, unknown> = {
      status: result.status,
      provider: "namecheap",
    };
    if (result.success) {
      update.provider_order_id = result.orderId;
      update.error_message = null;
    } else {
      update.error_message = result.error;
    }

    const { error: updErr } = await admin
      .from("domain_purchases")
      .update(update)
      .eq("id", purchaseId);
    if (updErr) console.error("[purchase-domain-secure] update error", updErr);

    return json(result, result.success ? 200 : 502);
  } catch (e) {
    console.error("[purchase-domain-secure] fatal", e);
    const msg = e instanceof Error ? e.message : "Internal error";
    return json({ error: msg }, 500);
  }
});
