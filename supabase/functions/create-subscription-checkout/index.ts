import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[SUBSCRIPTION-CHECKOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "AUTH_REQUIRED" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "SESSION_EXPIRED" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    const { planId, storeId, billingCycle } = await req.json();

    if (!planId || !storeId || !billingCycle) {
      throw new Error("Missing required fields: planId, storeId, billingCycle");
    }

    // Verify store ownership
    const { data: store, error: storeError } = await supabaseClient
      .from("stores")
      .select("id, owner_id, store_name")
      .eq("id", storeId)
      .single();

    if (storeError || !store) {
      throw new Error("Store not found");
    }
    if (store.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: "FORBIDDEN" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found or inactive");
    }

    logStep("Plan found", { name: plan.name, slug: plan.slug });

    // Free plan — just activate directly
    if (plan.price_monthly === 0 && plan.price_yearly === 0) {
      const now = new Date().toISOString();
      // Deactivate existing subscriptions
      await supabaseClient
        .from("store_subscriptions")
        .update({ status: "canceled", canceled_at: now })
        .eq("store_id", storeId)
        .in("status", ["active", "trial"]);

      // Create free subscription
      await supabaseClient.from("store_subscriptions").insert({
        store_id: storeId,
        plan_id: planId,
        status: "active",
        billing_cycle: "monthly",
        start_date: now,
      });

      // Log event
      await supabaseClient.from("subscription_events").insert({
        store_id: storeId,
        event_type: "plan_changed",
        metadata: { plan_slug: plan.slug, plan_name: plan.name, billing_cycle: "monthly" },
      });

      return new Response(JSON.stringify({ success: true, free: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Paid plan — create Stripe checkout
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
    const interval = billingCycle === "yearly" ? "year" : "month";

    // Get or create Stripe customer
    let customerId: string | undefined;
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id, store_id: storeId },
      });
      customerId = customer.id;
    }

    const origin = req.headers.get("origin") || "https://sokoby-04.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Sokoby ${plan.name}`,
              description: plan.description || `Abonnement ${plan.name}`,
            },
            unit_amount: Math.round(price * 100),
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/parametres/domaine?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/parametres/domaine?subscription=canceled`,
      metadata: {
        type: "store_subscription",
        user_id: user.id,
        store_id: storeId,
        plan_id: planId,
        plan_slug: plan.slug,
        billing_cycle: billingCycle,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          type: "store_subscription",
          store_id: storeId,
          plan_id: planId,
          plan_slug: plan.slug,
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
