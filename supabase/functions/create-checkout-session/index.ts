import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting checkout session creation...');
    
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not set');
      throw new Error('Stripe secret key is not configured');
    }
    console.log('Stripe key retrieved successfully');

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });
    console.log('Stripe instance created');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.email);

    const { planType } = await req.json();
    console.log('Plan type:', planType);

    const PRICE_IDS = {
      starter: 'price_1QbAUrI7adlqeYfap1MWxujV',
      pro: 'price_1QbAWeI7adlqeYfaUNskkYXF',
      enterprise: 'price_1QbAYDI7adlqeYfaRUI9dbH1'
    };

    const priceId = PRICE_IDS[planType as keyof typeof PRICE_IDS];
    if (!priceId) {
      throw new Error('Invalid plan type');
    }

    console.log('Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/plan-tarifaire`,
    });

    console.log('Checkout session created successfully:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in checkout session creation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});