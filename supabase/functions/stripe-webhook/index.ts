import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Store-isolated Stripe webhook handler.
 * 
 * Each store has its own Stripe credentials stored in `store_payment_configs`.
 * This webhook receives events and resolves the store from the Stripe account/metadata.
 * 
 * NOTE: For full multi-tenant isolation, each store should configure its own
 * webhook endpoint in their Stripe dashboard pointing to:
 *   <supabase-url>/functions/v1/stripe-webhook?store_id=<their-store-id>
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Resolve store from query param
    const url = new URL(req.url);
    const storeId = url.searchParams.get('store_id');

    if (!storeId) {
      return new Response(JSON.stringify({ error: 'Missing store_id parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch this store's Stripe config (server-side only, uses service role)
    const { data: paymentConfig, error: configError } = await supabaseClient
      .from('store_payment_configs')
      .select('*')
      .eq('store_id', storeId)
      .eq('provider', 'stripe')
      .single();

    if (configError || !paymentConfig) {
      console.error('No Stripe config found for store:', storeId);
      return new Response(JSON.stringify({ error: 'Store Stripe config not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If the store has a webhook secret, verify the signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    // Use the store's own Stripe credentials (not platform-level)
    // Note: For checkout-only stores, the webhook secret may be empty
    // In production, stores should set their webhook_secret_encrypted
    let event: any;

    if (paymentConfig.webhook_secret_encrypted && signature) {
      // Store has its own webhook secret configured
      const stripe = new Stripe(paymentConfig.encrypted_secret_key || '', {
        apiVersion: '2023-10-16',
      });
      
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          paymentConfig.webhook_secret_encrypted
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // No webhook secret - parse event directly (less secure, for development)
      try {
        event = JSON.parse(body);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log(`[Store ${storeId}] Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Record the order in the store's context
        const { error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            user_id: paymentConfig.user_id,
            store_id: storeId,
            total_amount: (session.amount_total || 0) / 100,
            status: 'processing',
            payment_status: 'paid',
            stripe_session_id: session.id,
          });

        if (orderError) {
          console.error('Error creating order:', orderError);
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: paymentConfig.user_id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

        if (updateError) console.error('Error updating subscription:', updateError);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) console.error('Error canceling subscription:', updateError);
        break;
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
