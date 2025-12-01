import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[INIT-STRIPE-PRODUCTS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Define our products
    const productsToCreate = [
      {
        id: 'sokoby_ai_store_starter',
        name: 'Plan Starter – Création Boutique IA',
        description: 'Création automatique de boutique avec 10 produits générés par IA, design professionnel, et pages essentielles.',
        price: 2000, // €20.00
        currency: 'eur',
      },
      {
        id: 'sokoby_ai_store_pro',
        name: 'Plan Pro – Création Boutique IA',
        description: 'Création automatique de boutique avec 50 produits générés par IA, optimisation SEO, support prioritaire, et design premium.',
        price: 8000, // €80.00
        currency: 'eur',
      },
    ];

    const createdPrices: Record<string, string> = {};

    // Check and create products/prices
    for (const productDef of productsToCreate) {
      logStep(`Checking product: ${productDef.id}`);

      // Search for existing product
      const existingProducts = await stripe.products.search({
        query: `metadata['product_id']:'${productDef.id}'`,
        limit: 1,
      });

      let product;
      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        logStep(`Found existing product: ${product.id}`);
      } else {
        // Create new product
        product = await stripe.products.create({
          name: productDef.name,
          description: productDef.description,
          metadata: {
            product_id: productDef.id,
          },
        });
        logStep(`Created new product: ${product.id}`);
      }

      // Search for existing price for this product
      const existingPrices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1,
      });

      let price;
      if (existingPrices.data.length > 0) {
        price = existingPrices.data[0];
        logStep(`Found existing price: ${price.id}`);
      } else {
        // Create new price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: productDef.price,
          currency: productDef.currency,
          metadata: {
            product_id: productDef.id,
          },
        });
        logStep(`Created new price: ${price.id}`);
      }

      createdPrices[productDef.id] = price.id;
    }

    logStep("All products and prices initialized", createdPrices);

    return new Response(JSON.stringify({ 
      success: true,
      prices: createdPrices,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in init-stripe-products", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
