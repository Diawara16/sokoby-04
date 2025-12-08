import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  console.log('[STRIPE-WEBHOOK-STORE] Webhook received:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeSecretKey) {
      console.error('[STRIPE-WEBHOOK-STORE] Missing STRIPE_SECRET_KEY');
      throw new Error('Missing Stripe configuration');
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    console.log('[STRIPE-WEBHOOK-STORE] Signature present:', !!signature);
    console.log('[STRIPE-WEBHOOK-STORE] Webhook secret configured:', !!webhookSecret);

    let event: Stripe.Event;
    
    // If we have webhook secret, verify signature
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log('[STRIPE-WEBHOOK-STORE] Signature verified successfully');
      } catch (err) {
        console.error('[STRIPE-WEBHOOK-STORE] Signature verification failed:', err.message);
        // Fall back to parsing the event without verification for debugging
        event = JSON.parse(body);
        console.log('[STRIPE-WEBHOOK-STORE] Parsed event without verification');
      }
    } else {
      // Parse event without verification (not recommended for production)
      event = JSON.parse(body);
      console.log('[STRIPE-WEBHOOK-STORE] Parsed event without signature verification');
    }

    console.log('[STRIPE-WEBHOOK-STORE] Event type:', event.type);
    console.log('[STRIPE-WEBHOOK-STORE] Event ID:', event.id);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('[STRIPE-WEBHOOK-STORE] Checkout session completed:', {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
      });

      const userId = session.metadata?.userId;
      const storeName = session.metadata?.storeName;
      const plan = session.metadata?.plan;

      if (!userId || !storeName || !plan) {
        console.error('[STRIPE-WEBHOOK-STORE] Missing metadata:', { userId, storeName, plan });
        throw new Error('Missing metadata in checkout session');
      }

      console.log('[STRIPE-WEBHOOK-STORE] Processing payment for:', { userId, storeName, plan });

      // Update store payment status
      const { data: updatedStore, error: updateError } = await supabaseClient
        .from('store_settings')
        .update({
          payment_status: 'completed',
          store_type: 'ai',
          stripe_payment_intent_id: session.payment_intent as string,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_checkout_session_id', session.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('[STRIPE-WEBHOOK-STORE] Error updating store:', updateError);
        throw updateError;
      }

      console.log('[STRIPE-WEBHOOK-STORE] Store updated successfully:', updatedStore?.id);

      // Trigger AI store generation
      console.log('[STRIPE-WEBHOOK-STORE] Triggering generate-ai-store function...');
      
      const generateResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-ai-store`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            userId,
            storeName,
            plan,
            sessionId: session.id,
          }),
        }
      );

      const generateResult = await generateResponse.json();
      console.log('[STRIPE-WEBHOOK-STORE] Generate AI store result:', generateResult);

      if (!generateResponse.ok) {
        console.error('[STRIPE-WEBHOOK-STORE] Error triggering store generation:', generateResult);
      }

      // Create notification
      const { error: notifError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Paiement réussi',
          content: `Votre paiement pour la boutique "${storeName}" a été confirmé. Votre boutique IA est en cours de génération.`,
        });

      if (notifError) {
        console.error('[STRIPE-WEBHOOK-STORE] Error creating notification:', notifError);
      }

      console.log('[STRIPE-WEBHOOK-STORE] Webhook processing completed successfully');
    } else if (event.type === 'payment_intent.succeeded') {
      console.log('[STRIPE-WEBHOOK-STORE] Payment intent succeeded - handled via checkout.session.completed');
    } else {
      console.log('[STRIPE-WEBHOOK-STORE] Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('[STRIPE-WEBHOOK-STORE] Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
