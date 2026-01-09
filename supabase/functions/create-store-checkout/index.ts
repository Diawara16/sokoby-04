import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
    logStep("Function started - PRODUCTION MODE");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    // PRODUCTION: Verify we're using LIVE Stripe key (starts with sk_live_)
    if (!stripeKey.startsWith('sk_live_')) {
      logStep("⚠️ WARNING: Not using LIVE Stripe key");
    } else {
      logStep("✓ LIVE Stripe key verified");
    }

    // Create Supabase client with service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // CRITICAL: Validate authorization header with explicit 401 response
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("Missing authorization header - returning 401");
      return new Response(JSON.stringify({ 
        error: "AUTH_REQUIRED",
        message: "Connexion requise. Veuillez vous connecter pour continuer.",
        authRequired: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseService.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep("Invalid or expired session - returning 401", { error: userError?.message });
      return new Response(JSON.stringify({ 
        error: "SESSION_EXPIRED",
        message: "Votre session a expiré. Veuillez vous reconnecter.",
        authRequired: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    const body = await req.json();
    const { storeName, plan, niche } = body;

    if (!storeName || !plan) {
      throw new Error("Missing required data: storeName and plan");
    }
    
    // Validate niche - default to 'general' if not provided
    const validNiches = ['fashion', 'electronics', 'beauty', 'home', 'fitness', 'kids', 'books', 'general'];
    const selectedNiche = validNiches.includes(niche) ? niche : 'general';
    
    logStep("Request data validated", { storeName, plan, niche: selectedNiche });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Map plan to Stripe product ID - PRODUCTION pricing
    const planProductIds = {
      starter: 'sokoby_ai_store_starter_live',
      pro: 'sokoby_ai_store_pro_live',
    };

    const productId = planProductIds[plan as keyof typeof planProductIds];
    if (!productId) {
      throw new Error("Invalid plan selected");
    }
    logStep("Plan validated", { plan, productId });

    // Get or create the Stripe products/prices
    const existingProducts = await stripe.products.search({
      query: `metadata['product_id']:'${productId}'`,
      limit: 1,
    });

    let priceId;
    if (existingProducts.data.length > 0) {
      const product = existingProducts.data[0];
      logStep("Found existing product", { productId: product.id });
      
      // Get the price for this product
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1,
      });
      
      if (prices.data.length > 0) {
        priceId = prices.data[0].id;
        logStep("Found existing price", { priceId });
      }
    }

    // If no price found, initialize products - PRODUCTION pricing
    if (!priceId) {
      logStep("No existing price found, initializing LIVE Stripe products...");
      
      // PRODUCTION product details with LIVE pricing
      const productDetails = {
        starter: {
          name: 'Plan Starter – Boutique IA Production',
          description: 'Création automatique de boutique LIVE avec 10 produits actifs, design professionnel, checkout fonctionnel.',
          price: 2000, // 20€
        },
        pro: {
          name: 'Plan Pro – Boutique IA Production',
          description: 'Création automatique de boutique LIVE avec 50 produits premium, images exclusives, optimisation SEO, support prioritaire.',
          price: 8000, // 80€
        },
      };

      const details = productDetails[plan as keyof typeof productDetails];
      
      // Create product
      const product = await stripe.products.create({
        name: details.name,
        description: details.description,
        metadata: {
          product_id: productId,
          type: 'ai_store',
          mode: 'production',
        },
      });
      logStep("Created new LIVE product", { productId: product.id });

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: details.price,
        currency: 'eur',
        metadata: {
          product_id: productId,
          mode: 'production',
        },
      });
      priceId = price.id;
      logStep("Created new LIVE price", { priceId });
    }

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

    // Check for existing store
    const { data: existingStore } = await supabaseService
      .from('store_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    let storeData;

    if (existingStore) {
      // Allow users with existing stores to proceed - update the existing store for payment
      logStep("Found existing store, updating for new payment", { 
        storeId: existingStore.id, 
        currentStatus: existingStore.store_status,
        isProduction: existingStore.is_production 
      });
      
      const { data: updatedStore, error: updateError } = await supabaseService
        .from('store_settings')
        .update({
          store_name: storeName,
          store_status: 'pending_payment',
          payment_status: 'pending',
          niche: selectedNiche, // Store niche for product generation
          domain_name: `${storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${user.id.substring(0, 8)}.sokoby.com`,
        })
        .eq('id', existingStore.id)
        .select()
        .single();

      if (updateError) {
        logStep("Store update error", { error: updateError });
        throw new Error(`Failed to update store record: ${updateError.message}`);
      }
      storeData = updatedStore;
      logStep("Existing store updated for payment", { storeId: storeData.id, niche: selectedNiche });
    } else {
      // Create new pending store record
      const { data: newStore, error: storeError } = await supabaseService
        .from('store_settings')
        .insert({
          user_id: user.id,
          store_name: storeName,
          store_type: 'ai',
          payment_status: 'pending',
          store_status: 'pending_payment',
          is_production: false, // Will be set to true after payment
          initial_products_generated: false,
          niche: selectedNiche, // Store niche for product generation
          domain_name: `${storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${user.id.substring(0, 8)}.sokoby.com`,
        })
        .select()
        .single();

      if (storeError) {
        logStep("Store creation error", { error: storeError });
        throw new Error(`Failed to create store record: ${storeError.message}`);
      }

      storeData = newStore;
      logStep("New pending store record created", { storeId: storeData.id, niche: selectedNiche });
    }

    // Create Stripe checkout session - PRODUCTION mode with niche in metadata
    const origin = req.headers.get("origin") || 'https://sokoby.com';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: "payment",
      // PRODUCTION: Redirect to success page with session_id for verification
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/creer-boutique-ia?payment=canceled`,
      payment_method_types: ['card'],
      metadata: {
        userId: user.id,
        storeName: storeName,
        plan: plan,
        niche: selectedNiche, // Pass niche to store generation
        storeId: storeData.id,
        mode: 'production',
      },
      // PRODUCTION: Enable billing address collection
      billing_address_collection: 'required',
      // PRODUCTION: Customer email
      customer_email: !customerId ? (profile?.email || user.email) : undefined,
    });

    logStep("LIVE Stripe checkout session created", { sessionId: session.id, url: session.url, niche: selectedNiche });

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
      storeId: storeData.id,
      niche: selectedNiche,
      mode: 'production'
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
