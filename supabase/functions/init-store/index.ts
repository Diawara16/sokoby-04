import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Method not allowed" }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Extract and validate authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, phone, niche, plan, shopifyShop } = await req.json();
    console.log("AI store initialization:", { name, email, phone, niche, plan, shopifyShop, userId: user.id });

    // Store initialization data temporarily
    const { error: storeError } = await supabase
      .from('store_settings')
      .upsert({
        id: user.id,
        store_name: name,
        niche: niche,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (storeError) {
      console.error("Error storing initialization data:", storeError);
    }

    // Determine checkout URL based on plan
    const checkoutUrl = plan === "pro"
      ? "https://checkout.shopify.com/pro-plan-checkout-url"
      : "https://checkout.shopify.com/starter-plan-checkout-url";

    // Generate Shopify OAuth URL
    const clientId = Deno.env.get('SHOPIFY_CLIENT_ID');
    const redirectUri = Deno.env.get('SHOPIFY_REDIRECT_URI') || 'https://your-app.lovable.app/shopify/callback';
    const scopes = "read_products,write_products,read_orders,write_orders";
    
    // Encode checkout URL in state parameter
    const state = btoa(JSON.stringify({ checkoutUrl, userId: user.id, email }));
    const shopifyAuthUrl = `https://${shopifyShop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;

    console.log("Returning Shopify auth URL:", shopifyAuthUrl);

    return new Response(
      JSON.stringify({ shopifyAuthUrl, checkoutUrl }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in init-store:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
