import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT-SESSION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use the service role key to perform writes (upsert) in Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { planType, paymentMethod, couponCode, billingPeriod = 'monthly' } = await req.json();
    logStep("Request data", { planType, paymentMethod, couponCode, billingPeriod });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // ⚠️ IMPORTANT: Remplacez ces Price IDs par ceux créés dans votre Dashboard Stripe
    // Phase 1: Prix en EUR uniquement (pour tous les utilisateurs)
    // 
    // Étapes pour créer les Price IDs dans Stripe:
    // 1. Allez sur https://dashboard.stripe.com/products
    // 2. Créez 3 produits: "Sokoby Essentiel", "Sokoby Pro", "Sokoby Premium"
    // 3. Pour chaque produit, créez 2 prix (mensuel et annuel) en EUR
    // 4. Copiez les Price IDs (format: price_xxxxxxxxxxxxx) et remplacez ci-dessous
    
    const MONTHLY_PRICE_IDS = {
      starter: 'price_MONTHLY_STARTER_EUR',      // À REMPLACER - Essentiel: €19/mois
      pro: 'price_MONTHLY_PRO_EUR',              // À REMPLACER - Pro: €39/mois
      enterprise: 'price_MONTHLY_PREMIUM_EUR'    // À REMPLACER - Premium: €119/mois
    };
    
    const ANNUAL_PRICE_IDS = {
      starter: 'price_ANNUAL_STARTER_EUR',       // À REMPLACER - Essentiel: €189/an (€15.75/mois)
      pro: 'price_ANNUAL_PRO_EUR',               // À REMPLACER - Pro: €389/an (€32.42/mois)
      enterprise: 'price_ANNUAL_PREMIUM_EUR'     // À REMPLACER - Premium: €1189/an (€99.08/mois)
    };

    const priceIds = billingPeriod === 'annual' ? ANNUAL_PRICE_IDS : MONTHLY_PRICE_IDS;
    const priceId = priceIds[planType as keyof typeof priceIds];
    if (!priceId) {
      throw new Error(`Plan type ${planType} with billing period ${billingPeriod} not supported`);
    }
    logStep("Price ID found", { planType, billingPeriod, priceId });

    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer, will create during checkout");
    }

    const origin = req.headers.get("origin") || "https://preview-sokoby-04.lovable.app";
    
    // Create checkout session
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      subscription_data: {
        trial_period_days: 14, // 14 jours d'essai gratuit
      },
      billing_address_collection: "required",
    };

    // Only add customer_update if we have an existing customer
    if (customerId) {
      sessionParams.customer_update = {
        name: "auto",
        address: "auto",
      };
    }

    // Add coupon if provided
    if (couponCode) {
      sessionParams.discounts = [{ coupon: couponCode }];
      logStep("Coupon applied", { couponCode });
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout-session", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});