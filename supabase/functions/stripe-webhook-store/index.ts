import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature || '',
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('Processing webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const storeName = session.metadata?.storeName;
      const plan = session.metadata?.plan;

      if (!userId || !storeName || !plan) {
        throw new Error('Missing metadata in checkout session');
      }

      console.log('Payment successful for user:', userId, 'storeName:', storeName, 'plan:', plan);

      // Update store payment status and set store_type to 'ai'
      const { error: updateError } = await supabaseClient
        .from('store_settings')
        .update({
          payment_status: 'completed',
          store_type: 'ai',
          stripe_payment_intent_id: session.payment_intent as string,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_checkout_session_id', session.id)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating store payment status:', updateError);
        throw updateError;
      }

      // Trigger AI store generation (fire and forget - don't wait for completion)
      supabaseClient.functions.invoke('generate-ai-store', {
        body: {
          userId,
          storeName,
          plan,
          sessionId: session.id,
        },
      }).then(({ error: functionError }) => {
        if (functionError) {
          console.error('Error invoking generate-ai-store function:', functionError);
        } else {
          console.log('AI store generation triggered successfully');
        }
      });

      // Create notification
      const { error: notifError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Paiement réussi',
          content: `Votre paiement pour la boutique "${storeName}" a été confirmé. Votre boutique IA est en cours de génération.`,
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
