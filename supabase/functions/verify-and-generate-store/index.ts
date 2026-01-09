import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * PRODUCTION: Verify payment and trigger store generation
 * Only creates stores after successful LIVE Stripe payment verification
 */
serve(async (req) => {
  const startTime = Date.now();
  console.log('='.repeat(60));
  console.log('[VERIFY-AND-GENERATE] START - PRODUCTION MODE at:', new Date().toISOString());
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

    // CRITICAL: Verify payment with Stripe LIVE API
    console.log('[VERIFY-AND-GENERATE] Verifying Stripe LIVE session...');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError) {
      console.error('[VERIFY-AND-GENERATE] Stripe session retrieval failed:', stripeError.message);
      throw new Error('Failed to retrieve Stripe session - payment verification failed');
    }

    console.log('[VERIFY-AND-GENERATE] Stripe session details:');
    console.log('  - Session ID:', session.id);
    console.log('  - Payment status:', session.payment_status);
    console.log('  - Status:', session.status);
    console.log('  - Payment intent:', session.payment_intent);
    console.log('  - Livemode:', session.livemode);
    console.log('  - Metadata:', JSON.stringify(session.metadata));

    // CRITICAL: Verify payment is actually PAID
    if (session.payment_status !== 'paid') {
      console.log('[VERIFY-AND-GENERATE] ✗ Payment NOT completed - status:', session.payment_status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          status: 'payment_pending',
          message: 'Le paiement n\'a pas encore été confirmé. Veuillez patienter.',
          paymentStatus: session.payment_status,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log('[VERIFY-AND-GENERATE] ✓ LIVE Payment verified as PAID');

    // Extract data from session - including niche
    const sessionUserId = session.metadata?.userId || session.client_reference_id;
    const storeName = session.metadata?.storeName || 'Ma Boutique IA';
    const plan = session.metadata?.plan || 'starter';
    const niche = session.metadata?.niche || 'general'; // Get niche from payment metadata
    const storeIdFromMeta = session.metadata?.storeId;
    
    // Use authenticated user if available, otherwise use session metadata
    const finalUserId = userId || sessionUserId;
    
    console.log('[VERIFY-AND-GENERATE] Final user ID:', finalUserId);
    console.log('[VERIFY-AND-GENERATE] Store name:', storeName);
    console.log('[VERIFY-AND-GENERATE] Plan:', plan);
    console.log('[VERIFY-AND-GENERATE] Niche:', niche);
    console.log('[VERIFY-AND-GENERATE] Store ID from metadata:', storeIdFromMeta);

    if (!finalUserId) {
      console.error('[VERIFY-AND-GENERATE] No user ID available');
      throw new Error('Impossible de déterminer l\'utilisateur. Veuillez vous reconnecter.');
    }

    // Find existing store
    console.log('[VERIFY-AND-GENERATE] Searching for store...');
    
    let store = null;
    
    // 1. Try by store ID from metadata
    if (storeIdFromMeta) {
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('id', storeIdFromMeta)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[VERIFY-AND-GENERATE] ✓ Found store by metadata ID:', store.id);
      }
    }
    
    // 2. Try by session ID
    if (!store) {
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('stripe_checkout_session_id', sessionId)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[VERIFY-AND-GENERATE] ✓ Found store by session ID:', store.id);
      }
    }
    
    // 3. Try by user ID
    if (!store) {
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('user_id', finalUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[VERIFY-AND-GENERATE] ✓ Found store by user ID:', store.id);
      }
    }

    // Check if already complete and production
    if (store && store.is_production && store.store_status === 'active' && store.initial_products_generated) {
      console.log('[VERIFY-AND-GENERATE] ✓ Store is already PRODUCTION ACTIVE:', store.id);
      return new Response(
        JSON.stringify({ 
          success: true, 
          storeId: store.id,
          status: 'already_complete',
          isProduction: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Update store payment status if found
    if (store) {
      if (store.payment_status !== 'completed') {
        console.log('[VERIFY-AND-GENERATE] Updating store payment status to COMPLETED...');
        const { error: updateError } = await supabaseClient
          .from('store_settings')
          .update({
            payment_status: 'completed',
            store_status: 'processing',
            store_type: 'ai',
            niche: niche, // Ensure niche is stored
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', store.id);

        if (updateError) {
          console.error('[VERIFY-AND-GENERATE] Error updating store:', updateError.message);
        } else {
          console.log('[VERIFY-AND-GENERATE] ✓ Store payment status updated to COMPLETED');
        }
      }
    }

    // Trigger PRODUCTION store generation with niche
    const storeToProcess = store;
    
    if (!storeToProcess?.initial_products_generated || !storeToProcess?.is_production) {
      console.log('[VERIFY-AND-GENERATE] Triggering PRODUCTION store generation with niche:', niche);
      
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
            niche, // Pass niche to generator
            sessionId,
            storeId: storeToProcess?.id,
            isProduction: true,
          }),
        });

        const generateResult = await generateResponse.json();
        console.log('[VERIFY-AND-GENERATE] Generate response:', generateResponse.status);
        console.log('[VERIFY-AND-GENERATE] Generate result:', JSON.stringify(generateResult));

        if (!generateResponse.ok) {
          console.error('[VERIFY-AND-GENERATE] ⚠ Generation failed:', generateResult);
          throw new Error(generateResult.error || 'Store generation failed');
        }
        
        console.log('[VERIFY-AND-GENERATE] ✓ PRODUCTION store generation completed');
        
        const duration = Date.now() - startTime;
        console.log('[VERIFY-AND-GENERATE] ✓ COMPLETE - PRODUCTION processing took', duration, 'ms');
        console.log('='.repeat(60));
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            storeId: generateResult.storeId,
            status: 'generated',
            productsCount: generateResult.productsCount,
            niche: niche,
            isProduction: true,
            storeStatus: 'active',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } catch (genError) {
        console.error('[VERIFY-AND-GENERATE] Error calling generate-ai-store:', genError.message);
        throw new Error('Erreur lors de la génération de la boutique: ' + genError.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log('[VERIFY-AND-GENERATE] ✓ COMPLETE - Took', duration, 'ms');
    console.log('='.repeat(60));

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: storeToProcess?.id,
        status: storeToProcess?.is_production ? 'already_complete' : 'processing',
        isProduction: storeToProcess?.is_production || false,
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
