
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// IDs de prix Stripe - vous devrez les mettre à jour avec vos vrais IDs de prix actifs
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

  try {
    console.log('Starting checkout session creation...');
    
    const { planType, paymentMethod, couponCode } = await req.json();
    console.log('Request data:', { planType, paymentMethod, couponCode });
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.email);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Vérifier si le produit existe et est actif
    const priceId = PRICE_IDS[planType as keyof typeof PRICE_IDS];
    if (!priceId) {
      throw new Error(`Invalid plan type: ${planType}`);
    }

    console.log('Using price ID:', priceId);

    // Déterminer les méthodes de paiement supportées
    let paymentMethodTypes: string[] = ['card'];
    
    // Pour l'instant, on utilise seulement 'card' car les autres nécessitent une configuration spéciale
    if (paymentMethod === 'card' || !paymentMethod) {
      paymentMethodTypes = ['card'];
    } else {
      // Pour les autres méthodes, on revient à 'card' pour éviter les erreurs
      console.log(`Payment method ${paymentMethod} not fully configured, using card instead`);
      paymentMethodTypes = ['card'];
    }

    console.log('Payment method types:', paymentMethodTypes);

    const sessionConfig: any = {
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
      payment_method_types: paymentMethodTypes,
      currency: 'usd',
      allow_promotion_codes: true,
    };

    // Ajouter le coupon si fourni
    if (couponCode) {
      sessionConfig.discounts = [{ coupon: couponCode }];
    }

    console.log('Creating checkout session with config:', JSON.stringify(sessionConfig, null, 2));

    const session = await stripe.checkout.sessions.create(sessionConfig);

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
    
    let errorMessage = 'Une erreur est survenue lors de la création de la session de paiement';
    
    if (error.message?.includes('product is not active')) {
      errorMessage = 'Le produit sélectionné n\'est pas actif. Veuillez contacter le support.';
    } else if (error.message?.includes('Invalid payment_method_types')) {
      errorMessage = 'Méthode de paiement non supportée. Veuillez utiliser une carte bancaire.';
    } else if (error.message?.includes('price')) {
      errorMessage = 'Erreur de configuration des prix. Veuillez contacter le support.';
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
