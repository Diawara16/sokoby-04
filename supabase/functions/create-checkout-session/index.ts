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
    
    // Define pricing based on plan and billing period
    const planPrices = {
      starter: {
        monthly: { amount: 1900, name: 'Sokoby Essentiel - Mensuel' },
        annual: { amount: 18900, name: 'Sokoby Essentiel - Annuel' }
      },
      pro: {
        monthly: { amount: 3900, name: 'Sokoby Pro - Mensuel' },
        annual: { amount: 38900, name: 'Sokoby Pro - Annuel' }
      },
      enterprise: {
        monthly: { amount: 11900, name: 'Sokoby Premium - Mensuel' },
        annual: { amount: 118900, name: 'Sokoby Premium - Annuel' }
      }
    };

    const planData = planPrices[planType as keyof typeof planPrices]?.[billingPeriod as 'monthly' | 'annual'];
    if (!planData) {
      throw new Error(`Plan type ${planType} with billing period ${billingPeriod} not supported`);
    }
    logStep("Plan pricing determined", { planType, billingPeriod, amount: planData.amount });

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
          price_data: {
            currency: 'eur',
            product_data: {
              name: planData.name,
              description: `Abonnement ${planType === 'starter' ? 'Essentiel' : planType === 'pro' ? 'Pro' : 'Premium'}`,
            },
            unit_amount: planData.amount,
            recurring: {
              interval: billingPeriod === 'annual' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          user_id: user.id,
          plan_type: planType,
          billing_period: billingPeriod,
        },
      },
      billing_address_collection: "required",
      metadata: {
        user_id: user.id,
        plan_type: planType,
        billing_period: billingPeriod,
      },
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