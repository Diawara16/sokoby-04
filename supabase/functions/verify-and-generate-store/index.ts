import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Fallback function called from the Success page to verify payment and trigger store generation
 * if the webhook hasn't already processed it.
 */
serve(async (req) => {
  const startTime = Date.now();
  console.log('='.repeat(60));
  console.log('[VERIFY-AND-GENERATE] START at:', new Date().toISOString());
  console.log('[VERIFY-AND-GENERATE] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const body = await req.text();
    console.log('[VERIFY-AND-GENERATE] Raw body:', body);
    
    let requestData;
    try {
      requestData = JSON.parse(body);
    } catch (e) {
      console.error('[VERIFY-AND-GENERATE] Failed to parse JSON:', e.message);
      throw new Error('Invalid JSON body');
    }
    
    const { sessionId } = requestData;
    console.log('[VERIFY-AND-GENERATE] Session ID:', sessionId);

    if (!sessionId) {
      throw new Error('Missing sessionId');
    }

    // Check environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    console.log('[VERIFY-AND-GENERATE] ENV CHECK:');
    console.log('  - SUPABASE_URL:', supabaseUrl ? '✓ loaded' : '✗ MISSING');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ loaded' : '✗ MISSING');
    console.log('  - STRIPE_SECRET_KEY:', stripeSecretKey ? '✓ loaded' : '✗ MISSING');

    if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
      throw new Error('Missing required environment variables');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    console.log('[VERIFY-AND-GENERATE] Auth header present:', !!authHeader);
    
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (authError) {
        console.error('[VERIFY-AND-GENERATE] Auth error:', authError.message);
      } else if (user) {
        userId = user.id;
        console.log('[VERIFY-AND-GENERATE] ✓ Authenticated user:', userId);
      }
    }

    // Verify payment with Stripe
    console.log('[VERIFY-AND-GENERATE] Verifying Stripe session...');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError) {
      console.error('[VERIFY-AND-GENERATE] Stripe session retrieval failed:', stripeError.message);
      throw new Error('Failed to retrieve Stripe session');
    }

    console.log('[VERIFY-AND-GENERATE] Stripe session details:');
    console.log('  - Session ID:', session.id);
    console.log('  - Payment status:', session.payment_status);
    console.log('  - Status:', session.status);
    console.log('  - Payment intent:', session.payment_intent);
    console.log('  - Metadata:', JSON.stringify(session.metadata));

    // Check if payment is complete
    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      console.log('[VERIFY-AND-GENERATE] Payment not completed yet');
      return new Response(
        JSON.stringify({ 
          success: false, 
          status: 'payment_pending',
          message: 'Payment not yet completed',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log('[VERIFY-AND-GENERATE] ✓ Payment verified as complete');

    // Extract data from session
    const sessionUserId = session.metadata?.userId || session.client_reference_id;
    const storeName = session.metadata?.storeName || 'Ma Boutique IA';
    const plan = session.metadata?.plan || 'starter';
    
    // Use authenticated user if available, otherwise use session metadata
    const finalUserId = userId || sessionUserId;
    
    console.log('[VERIFY-AND-GENERATE] Final user ID:', finalUserId);
    console.log('[VERIFY-AND-GENERATE] Store name:', storeName);
    console.log('[VERIFY-AND-GENERATE] Plan:', plan);

    if (!finalUserId) {
      console.error('[VERIFY-AND-GENERATE] No user ID available');
      throw new Error('Could not determine user ID');
    }

    // Find existing store
    console.log('[VERIFY-AND-GENERATE] Searching for store...');
    const { data: store, error: storeError } = await supabaseClient
      .from('store_settings')
      .select('*')
      .eq('stripe_checkout_session_id', sessionId)
      .single();

    if (storeError) {
      console.log('[VERIFY-AND-GENERATE] Store not found by session ID, searching by user ID...');
      
      const { data: storeByUser, error: userStoreError } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('user_id', finalUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (userStoreError || !storeByUser) {
        console.log('[VERIFY-AND-GENERATE] No store found - will be created by generate-ai-store');
      } else if (storeByUser.payment_status === 'completed' && storeByUser.initial_products_generated) {
        console.log('[VERIFY-AND-GENERATE] ✓ Store already complete:', storeByUser.id);
        return new Response(
          JSON.stringify({ 
            success: true, 
            storeId: storeByUser.id,
            status: 'already_complete',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    } else if (store) {
      console.log('[VERIFY-AND-GENERATE] Found store:', store.id);
      
      // Check if already complete
      if (store.payment_status === 'completed' && store.initial_products_generated) {
        console.log('[VERIFY-AND-GENERATE] ✓ Store already complete');
        return new Response(
          JSON.stringify({ 
            success: true, 
            storeId: store.id,
            status: 'already_complete',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Update payment status if not already completed
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
          console.error('[VERIFY-AND-GENERATE] Error updating store:', updateError.message);
        } else {
          console.log('[VERIFY-AND-GENERATE] ✓ Store payment status updated');
        }
      }
    }

    // Trigger product generation if needed
    const storeToCheck = store || (await supabaseClient
      .from('store_settings')
      .select('*')
      .eq('user_id', finalUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()).data;

    if (!storeToCheck?.initial_products_generated) {
      console.log('[VERIFY-AND-GENERATE] Triggering store generation...');
      
      const generateUrl = `${supabaseUrl}/functions/v1/generate-ai-store`;
      console.log('[VERIFY-AND-GENERATE] Calling:', generateUrl);
      
      try {
        const generateResponse = await fetch(generateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            userId: finalUserId,
            storeName,
            plan,
            sessionId,
          }),
        });

        const generateResult = await generateResponse.json();
        console.log('[VERIFY-AND-GENERATE] Generate response:', generateResponse.status);
        console.log('[VERIFY-AND-GENERATE] Generate result:', JSON.stringify(generateResult));

        if (!generateResponse.ok) {
          console.error('[VERIFY-AND-GENERATE] ⚠ Generation failed:', generateResult);
        } else {
          console.log('[VERIFY-AND-GENERATE] ✓ Store generation triggered');
          
          const duration = Date.now() - startTime;
          console.log('[VERIFY-AND-GENERATE] ✓ COMPLETE - Took', duration, 'ms');
          console.log('='.repeat(60));
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              storeId: generateResult.storeId,
              status: 'generated',
              productsCount: generateResult.productsCount,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }
      } catch (genError) {
        console.error('[VERIFY-AND-GENERATE] Error calling generate-ai-store:', genError.message);
        throw genError;
      }
    }

    const duration = Date.now() - startTime;
    console.log('[VERIFY-AND-GENERATE] ✓ COMPLETE - Took', duration, 'ms');
    console.log('='.repeat(60));

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: storeToCheck?.id,
        status: storeToCheck?.initial_products_generated ? 'already_complete' : 'processing',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('[VERIFY-AND-GENERATE] ✗ ERROR:', error.message);
    console.error('[VERIFY-AND-GENERATE] Stack:', error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
