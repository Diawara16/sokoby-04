import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STORE-CHECKOUT] ${step}${detailsStr}`);
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

    // Create Supabase client with service role key to create orders
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseService.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const body = await req.json();
    const { storeName, plan } = body;

    if (!storeName || !plan) {
      throw new Error("Missing required data: storeName and plan");
    }
    logStep("Request data validated", { storeName, plan });

    // Determine pricing based on plan
    const planPrices = {
      starter: { amount: 2000, name: 'Plan Starter - Boutique IA' }, // €20
      pro: { amount: 8000, name: 'Plan Pro - Boutique IA' }, // €80
    };

    const planData = planPrices[plan as keyof typeof planPrices];
    if (!planData) {
      throw new Error("Invalid plan selected");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get or create Stripe customer for the user
    const { data: profile } = await supabaseService
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    let customerId;
    if (profile?.email) {
      const customers = await stripe.customers.list({ 
        email: profile.email, 
        limit: 1 
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing Stripe customer found", { customerId });
      } else {
        const customer = await stripe.customers.create({
          email: profile.email,
          name: profile.full_name || 'Customer',
          metadata: {
            user_id: user.id,
          }
        });
        customerId = customer.id;
        logStep("New Stripe customer created", { customerId });
      }
    }

    // Create pending store record
    const { data: storeData, error: storeError } = await supabaseService
      .from('store_settings')
      .insert({
        user_id: user.id,
        store_name: storeName,
        store_type: 'ai',
        payment_status: 'pending',
        initial_products_generated: false,
        domain_name: `${storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${user.id.substring(0, 8)}.sokoby.com`,
      })
      .select()
      .single();

    if (storeError) {
      logStep("Store creation error", { error: storeError });
      throw new Error(`Failed to create store record: ${storeError.message}`);
    }

    logStep("Pending store record created", { storeId: storeData.id });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: planData.name,
            description: `Création automatique de boutique avec ${plan === 'starter' ? '10' : '50'} produits générés par IA`,
          },
          unit_amount: planData.amount,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/tableau-de-bord?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/creer-boutique-ia?payment=canceled`,
      payment_method_types: ['card'],
      metadata: {
        userId: user.id,
        storeName: storeName,
        plan: plan,
        storeId: storeData.id,
      }
    });

    logStep("Stripe checkout session created", { sessionId: session.id, url: session.url });

    // Update store with session ID
    const { error: updateError } = await supabaseService
      .from('store_settings')
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq('id', storeData.id);

    if (updateError) {
      logStep("Store update error", { error: updateError });
    }

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id,
      storeId: storeData.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-store-checkout", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Une erreur est survenue lors de la création de la session de paiement"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});