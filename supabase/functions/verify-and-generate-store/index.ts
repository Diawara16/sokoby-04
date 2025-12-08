import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * This function is called from the Success page to verify payment and trigger store generation
 * if the webhook hasn't already processed it. This is a fallback mechanism.
 */
serve(async (req) => {
  console.log('[VERIFY-AND-GENERATE] Function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    
    console.log('[VERIFY-AND-GENERATE] Session ID:', sessionId);

    if (!sessionId) {
      throw new Error('Missing sessionId');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get auth user from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('[VERIFY-AND-GENERATE] Auth error:', authError);
      throw new Error('Unauthorized');
    }

    console.log('[VERIFY-AND-GENERATE] User authenticated:', user.id);

    // Find the store with this session ID
    const { data: store, error: storeError } = await supabaseClient
      .from('store_settings')
      .select('*')
      .eq('stripe_checkout_session_id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (storeError || !store) {
      console.error('[VERIFY-AND-GENERATE] Store not found:', storeError);
      throw new Error('Store not found');
    }

    console.log('[VERIFY-AND-GENERATE] Store found:', {
      id: store.id,
      paymentStatus: store.payment_status,
      productsGenerated: store.initial_products_generated,
    });

    // If already completed and generated, return success
    if (store.payment_status === 'completed' && store.initial_products_generated) {
      console.log('[VERIFY-AND-GENERATE] Store already complete');
      return new Response(
        JSON.stringify({ 
          success: true, 
          storeId: store.id,
          status: 'already_complete',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Verify payment with Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    console.log('[VERIFY-AND-GENERATE] Verifying Stripe session...');
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('[VERIFY-AND-GENERATE] Stripe session status:', {
      paymentStatus: session.payment_status,
      status: session.status,
    });

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      console.log('[VERIFY-AND-GENERATE] Payment not completed');
      return new Response(
        JSON.stringify({ 
          success: false, 
          status: 'payment_pending',
          message: 'Payment not yet completed',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Payment verified! Update store status if not already done
    if (store.payment_status !== 'completed') {
      console.log('[VERIFY-AND-GENERATE] Updating store payment status...');
      
      const { error: updateError } = await supabaseClient
        .from('store_settings')
        .update({
          payment_status: 'completed',
          store_type: 'ai',
          stripe_payment_intent_id: session.payment_intent as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', store.id);

      if (updateError) {
        console.error('[VERIFY-AND-GENERATE] Error updating store:', updateError);
        throw updateError;
      }
    }

    // Trigger product generation if not done
    if (!store.initial_products_generated) {
      console.log('[VERIFY-AND-GENERATE] Triggering store generation...');
      
      const plan = session.metadata?.plan || 'starter';
      const storeName = session.metadata?.storeName || store.store_name;
      
      const generateResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-ai-store`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            userId: user.id,
            storeName,
            plan,
            sessionId,
          }),
        }
      );

      const generateResult = await generateResponse.json();
      console.log('[VERIFY-AND-GENERATE] Generate result:', generateResult);

      if (!generateResponse.ok) {
        console.error('[VERIFY-AND-GENERATE] Generation failed:', generateResult);
        throw new Error('Store generation failed');
      }
    }

    console.log('[VERIFY-AND-GENERATE] Complete');

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: store.id,
        status: 'generated',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[VERIFY-AND-GENERATE] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
