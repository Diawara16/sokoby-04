import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { name, email, phone, niche, plan } = await req.json();

    console.log("AI store initialization:", { name, email, phone, niche, plan });

    // Determine checkout URL based on plan
    const checkoutUrl = plan === "pro"
      ? "https://checkout.shopify.com/pro-plan-checkout-url"
      : "https://checkout.shopify.com/starter-plan-checkout-url";

    console.log("Returning checkout URL:", checkoutUrl);

    return new Response(
      JSON.stringify({ checkoutUrl }),
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
