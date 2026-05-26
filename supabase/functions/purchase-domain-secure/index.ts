// purchase-domain-secure
// Completes a pending domain reservation by calling Namecheap securely.
//
// HARD REQUIREMENTS BEFORE NAMECHEAP IS CALLED:
//   1. Authenticated user (JWT).
//   2. Caller owns the reservation.
//   3. Reservation has a verified Stripe payment (session paid, amount >= required).
//   4. User has an active paid plan (server-side subscription validation).
//   5. Per-user rate limit not exceeded.
//   6. Computed price within configured maximum.
//   7. Duplicate-purchase / in-progress lock honored.
//
// Sandbox-first: defaults to Namecheap sandbox unless NAMECHEAP_SANDBOX="false".
// Operates EXCLUSIVELY on public.domain_purchases.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { buildNamecheapRequest } from "../_shared/namecheap-relay.ts";
import { checkAvailabilityAndPrice } from "../_shared/namecheap-pricing.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TIMEOUT_MS = 25_000;
const MAX_DOMAIN_PRICE_USD = Number(Deno.env.get("DOMAIN_MAX_PRICE_USD") || "2500");
const MARKUP_USD = Number(Deno.env.get("DOMAIN_MARKUP_USD") || "5");
const RATE_LIMIT_PER_HOUR = Number(Deno.env.get("DOMAIN_RATE_LIMIT_PER_HOUR") || "10");
// Safety switch: when "false", all real registrations require a verified Stripe payment.
// When "true" (default during sandbox dev), payment verification is bypassed ONLY if
// NAMECHEAP_SANDBOX is also true. Production cutover must set this to "false".
const ALLOW_UNPAID_SANDBOX = (Deno.env.get("ALLOW_UNPAID_SANDBOX") ?? "true").toLowerCase() === "true";

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

    if (ok) return { success: true, status: "purchased", orderId, error: null };
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
    const purchaseId: string | undefined = body.purchaseId ?? body.domainId;
    const years = Math.min(Math.max(Number(body.years) || 1, 1), 10);
    const sessionIdFromClient: string | undefined = body.stripeSessionId;

    if (!purchaseId || typeof purchaseId !== "string") {
      return json({ error: "purchaseId required" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- Rate limit (per user, last hour) -----------------------------------
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await admin
      .from("domain_purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since);
    if ((recentCount ?? 0) > RATE_LIMIT_PER_HOUR) {
      return json({ error: "RATE_LIMITED" }, 429);
    }

    // --- Load reservation ---------------------------------------------------
    const { data: row, error: loadErr } = await admin
      .from("domain_purchases")
      .select("id, user_id, domain_name, status, provider, price_estimate, stripe_session_id, stripe_payment_intent_id, amount_paid_cents, paid_at")
      .eq("id", purchaseId)
      .maybeSingle();

    if (loadErr) return json({ error: loadErr.message }, 500);
    if (!row) return json({ error: "Purchase reservation not found" }, 404);
    if (row.user_id !== user.id) return json({ error: "FORBIDDEN" }, 403);
    if (!row.domain_name) return json({ error: "Invalid reservation" }, 400);

    if (row.status === "purchased") {
      return json({ success: true, status: "purchased", orderId: null, alreadyPurchased: true });
    }
    if (row.status === "purchasing") {
      return json({ error: "Purchase already in progress" }, 409);
    }

    // --- Server-side subscription validation --------------------------------
    const { data: stripeProfile } = await admin
      .from("Stripe")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();
    const planOk = !!(stripeProfile && stripeProfile.plan && stripeProfile.plan !== "free");

    // --- Price cap ----------------------------------------------------------
    const basePrice = Number(row.price_estimate) > 0 ? Number(row.price_estimate) : DEFAULT_DOMAIN_PRICE_USD;
    const requiredUsd = (basePrice + MARKUP_USD) * years;
    if (requiredUsd > MAX_DOMAIN_PRICE_USD) {
      return json({ error: "PRICE_EXCEEDS_MAX", maxUsd: MAX_DOMAIN_PRICE_USD, requiredUsd }, 400);
    }
    const requiredCents = Math.round(requiredUsd * 100);

    // --- Stripe payment verification ----------------------------------------
    const sandbox = (Deno.env.get("NAMECHEAP_SANDBOX") ?? "true").toLowerCase() !== "false";
    const bypassPayment = ALLOW_UNPAID_SANDBOX && sandbox;

    let verifiedSessionId: string | null = row.stripe_session_id ?? null;
    let verifiedIntentId: string | null = row.stripe_payment_intent_id ?? null;
    let verifiedAmountCents: number | null = row.amount_paid_cents ?? null;
    let verifiedCurrency = "usd";

    if (!bypassPayment) {
      if (!planOk) {
        return json({ error: "SUBSCRIPTION_REQUIRED" }, 402);
      }

      const sessionId = sessionIdFromClient ?? row.stripe_session_id ?? null;
      if (!sessionId) {
        return json({ error: "PAYMENT_REQUIRED", message: "No Stripe session associated with this reservation." }, 402);
      }

      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (!stripeKey) return json({ error: "Stripe not configured" }, 500);
      const stripe = new Stripe(stripeKey, { apiVersion: "2024-04-10" });

      let session: Stripe.Checkout.Session;
      try {
        session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["payment_intent"],
        });
      } catch (e) {
        return json({ error: "PAYMENT_VERIFICATION_FAILED", message: e instanceof Error ? e.message : "stripe error" }, 402);
      }

      // Bind session to this user + purchase
      if (session.metadata?.userId && session.metadata.userId !== user.id) {
        return json({ error: "PAYMENT_OWNER_MISMATCH" }, 403);
      }
      if (session.metadata?.purchaseId && session.metadata.purchaseId !== purchaseId) {
        return json({ error: "PAYMENT_PURCHASE_MISMATCH" }, 403);
      }
      if (session.payment_status !== "paid") {
        return json({ error: "PAYMENT_NOT_COMPLETED", payment_status: session.payment_status }, 402);
      }
      const paidCents = session.amount_total ?? 0;
      if (paidCents < requiredCents) {
        return json({
          error: "PAYMENT_INSUFFICIENT",
          paidCents,
          requiredCents,
        }, 402);
      }

      verifiedSessionId = session.id;
      verifiedCurrency = (session.currency || "usd").toLowerCase();
      verifiedAmountCents = paidCents;
      verifiedIntentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

      // Guard against double-redemption of the same Stripe session
      const { data: collision } = await admin
        .from("domain_purchases")
        .select("id")
        .eq("stripe_session_id", session.id)
        .neq("id", purchaseId)
        .maybeSingle();
      if (collision) {
        return json({ error: "PAYMENT_ALREADY_USED" }, 409);
      }
    }

    // --- Atomic lock: pending|failed -> purchasing --------------------------
    const { data: locked, error: lockErr } = await admin
      .from("domain_purchases")
      .update({
        status: "purchasing",
        error_message: null,
        years,
        stripe_session_id: verifiedSessionId,
        stripe_payment_intent_id: verifiedIntentId,
        amount_paid_cents: verifiedAmountCents,
        payment_currency: verifiedCurrency,
        paid_at: verifiedAmountCents != null ? new Date().toISOString() : null,
      })
      .eq("id", purchaseId)
      .in("status", ["pending", "failed"])
      .select("id")
      .maybeSingle();

    if (lockErr) return json({ error: lockErr.message }, 500);
    if (!locked) return json({ error: "Reservation not in a state that can be purchased" }, 409);

    console.log(
      `[purchase-domain-secure] user=${user.id} domain=${row.domain_name} years=${years} paid=${verifiedAmountCents}c session=${verifiedSessionId ?? "n/a"} bypass=${bypassPayment}`,
    );

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
