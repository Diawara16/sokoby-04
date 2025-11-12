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
    const userId = url.searchParams.get("userId");

    console.log("Payment success received:", { checkoutId, email, userId });

    if (!userId) {
      throw new Error("User ID is required");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update store status to active
    const { error: updateError } = await supabase
      .from('store_settings')
      .update({
        status: 'active',
        payment_status: 'paid',
        checkout_id: checkoutId,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error("Error updating store:", updateError);
      throw updateError;
    }

    console.log("AI store activated successfully");

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
