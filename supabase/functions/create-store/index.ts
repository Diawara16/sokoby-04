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

  try {
    const url = new URL(req.url);
    const checkoutId = url.searchParams.get("checkoutId");
    const email = url.searchParams.get("email");

    console.log("Payment success received:", { checkoutId, email });

    const store = {
      id: Date.now(),
      type: "ai",
      email,
      checkoutId,
      createdAt: new Date().toISOString(),
    };

    console.log("AI store created:", store);

    // Redirect to dashboard with success parameter
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': '/dashboard?success=1',
      },
    });
  } catch (error) {
    console.error("Error in create-store:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
