// create-domain-checkout
// Creates a Stripe Checkout Session for a pending domain purchase.
// The resulting session_id is stored on the domain_purchases row and is
// later verified by purchase-domain-secure before any Namecheap call.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@14.21.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_DOMAIN_PRICE_USD = Number(Deno.env.get("DOMAIN_DEFAULT_PRICE_USD") || "15");
const MAX_DOMAIN_PRICE_USD = Number(Deno.env.get("DOMAIN_MAX_PRICE_USD") || "100");
const MARKUP_USD = Number(Deno.env.get("DOMAIN_MARKUP_USD") || "5");
const RATE_LIMIT_PER_HOUR = Number(Deno.env.get("DOMAIN_RATE_LIMIT_PER_HOUR") || "10");

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
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
    const purchaseId: string | undefined = body.purchaseId;
    const years = Math.min(Math.max(Number(body.years) || 1, 1), 10);
    const successUrl: string = body.successUrl ||
      `${req.headers.get("origin") || ""}/parametres/domaines?purchase=success`;
    const cancelUrl: string = body.cancelUrl ||
      `${req.headers.get("origin") || ""}/parametres/domaines?purchase=cancelled`;

    if (!purchaseId) return json({ error: "purchaseId required" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Rate limit: max N purchase attempts (rows) per user per hour
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await admin
      .from("domain_purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since);
    if ((recentCount ?? 0) > RATE_LIMIT_PER_HOUR) {
      return json({ error: "RATE_LIMITED", message: "Too many domain purchase attempts. Please try again later." }, 429);
    }

    // Load reservation
    const { data: row, error: loadErr } = await admin
      .from("domain_purchases")
      .select("id, user_id, domain_name, status, price_estimate, currency, stripe_session_id, paid_at")
      .eq("id", purchaseId)
      .maybeSingle();

    if (loadErr) return json({ error: loadErr.message }, 500);
    if (!row) return json({ error: "Purchase reservation not found" }, 404);
    if (row.user_id !== user.id) return json({ error: "FORBIDDEN" }, 403);
    if (row.status === "purchased") return json({ error: "Already purchased" }, 409);
    if (row.status === "purchasing") return json({ error: "Purchase already in progress" }, 409);
    if (row.paid_at) return json({ error: "Payment already completed for this reservation" }, 409);

    // Server-side subscription validation
    const { data: stripeProfile } = await admin
      .from("Stripe")
      .select("plan, trial_expired")
      .eq("id", user.id)
      .maybeSingle();
    const planOk = stripeProfile && stripeProfile.plan && stripeProfile.plan !== "free";
    if (!planOk) {
      return json({
        error: "SUBSCRIPTION_REQUIRED",
        message: "An active paid plan is required to purchase domains.",
      }, 402);
    }

    // Price computation (USD cents)
    const basePrice = Number(row.price_estimate) > 0 ? Number(row.price_estimate) : DEFAULT_DOMAIN_PRICE_USD;
    const totalUsd = (basePrice + MARKUP_USD) * years;
    if (totalUsd > MAX_DOMAIN_PRICE_USD) {
      return json({
        error: "PRICE_EXCEEDS_MAX",
        message: `Domain price ${totalUsd} USD exceeds maximum allowed ${MAX_DOMAIN_PRICE_USD} USD.`,
      }, 400);
    }
    const amountCents = Math.round(totalUsd * 100);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe not configured" }, 500);
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-04-10",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email ?? undefined,
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: `Domain registration: ${row.domain_name}`,
            description: `${years} year(s) registration via Sokoby`,
          },
        },
        quantity: 1,
      }],
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}&purchaseId=${purchaseId}`,
      cancel_url: cancelUrl,
      metadata: {
        purchaseId,
        userId: user.id,
        domain: row.domain_name,
        years: String(years),
      },
    });

    // Persist session id on the reservation
    await admin
      .from("domain_purchases")
      .update({
        stripe_session_id: session.id,
        years,
        amount_paid_cents: null,
        payment_currency: "usd",
        error_message: null,
      })
      .eq("id", purchaseId);

    return json({ sessionId: session.id, url: session.url, amountCents });
  } catch (e) {
    console.error("[create-domain-checkout]", e);
    const msg = e instanceof Error ? e.message : "Internal error";
    return json({ error: msg }, 500);
  }
});
