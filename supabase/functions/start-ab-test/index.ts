import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

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
    const { testData } = await req.json();
    console.log("Starting A/B test with data:", testData);

    // Créer deux variantes de campagne pour le test A/B
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Créer la campagne A
    const { data: campaignA, error: errorA } = await supabase
      .from('email_campaigns')
      .insert({
        name: `${testData.name} - Variante A`,
        subject: testData.variant_a,
        content: `Contenu de test pour la variante A`,
        status: 'draft',
        user_id: testData.user_id,
        metadata: { test_group: 'A' }
      })
      .select()
      .single();

    if (errorA) throw errorA;

    // Créer la campagne B
    const { data: campaignB, error: errorB } = await supabase
      .from('email_campaigns')
      .insert({
        name: `${testData.name} - Variante B`,
        subject: testData.variant_b,
        content: `Contenu de test pour la variante B`,
        status: 'draft',
        user_id: testData.user_id,
        metadata: { test_group: 'B' }
      })
      .select()
      .single();

    if (errorB) throw errorB;

    console.log("A/B test campaigns created successfully:", { campaignA, campaignB });

    return new Response(
      JSON.stringify({ 
        success: true, 
        campaigns: { campaignA, campaignB }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Error in start-ab-test function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});