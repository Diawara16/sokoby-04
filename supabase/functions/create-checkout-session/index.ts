import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICE_IDS = {
  starter: 'price_1QbAUrI7adlqeYfap1MWxujV',
  pro: 'price_1QbAWeI7adlqeYfaUNskkYXF',
  enterprise: 'price_1QbAYDI7adlqeYfaRUI9dbH1'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  try {
    // Get the session or user object
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    const email = user?.email;

    if (!email) {
      throw new Error('No email found');
    }

    const { planType, paymentMethod = 'card' } = await req.json();
    const priceId = PRICE_IDS[planType as keyof typeof PRICE_IDS];

    if (!priceId) {
      throw new Error('Invalid plan type');
    }

    console.log('Creating Stripe instance...');
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Vérifier si l'utilisateur existe déjà comme client Stripe
    console.log('Checking if customer exists...');
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer_id = undefined;
    if (customers.data.length > 0) {
      customer_id = customers.data[0].id;
      // Vérifier si déjà abonné à ce prix
      const subscriptions = await stripe.subscriptions.list({
        customer: customers.data[0].id,
        status: 'active',
        price: priceId,
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        throw new Error("Vous êtes déjà abonné à ce plan");
      }
    }

    console.log('Creating payment session...');
    console.log('Payment method:', paymentMethod);
    
    // Configuration des méthodes de paiement
    let payment_method_types = ['card'];
    if (paymentMethod === 'apple_pay') {
      payment_method_types = ['card', 'apple_pay'];
    } else if (paymentMethod === 'google_pay') {
      payment_method_types = ['card', 'google_pay'];
    }

    // Configuration spécifique pour Apple Pay
    const payment_method_options = paymentMethod === 'apple_pay' ? {
      apple_pay: {
        setup_future_usage: 'off_session',
      }
    } : undefined;

    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types,
      payment_method_options,
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/plan-tarifaire`,
      automatic_tax: { enabled: true },
    });

    console.log('Payment session created:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating payment session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});