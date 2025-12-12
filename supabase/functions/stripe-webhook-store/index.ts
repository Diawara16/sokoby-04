import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  const startTime = Date.now();
  console.log('='.repeat(60));
  console.log('[STRIPE-WEBHOOK] START - Webhook received at:', new Date().toISOString());
  console.log('[STRIPE-WEBHOOK] Method:', req.method);
  
  // Log all environment variables availability
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  
  console.log('[STRIPE-WEBHOOK] ENV CHECK:');
  console.log('  - SUPABASE_URL:', supabaseUrl ? '✓ loaded' : '✗ MISSING');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ loaded' : '✗ MISSING');
  console.log('  - STRIPE_SECRET_KEY:', stripeSecretKey ? '✓ loaded' : '✗ MISSING');
  console.log('  - STRIPE_WEBHOOK_SECRET:', webhookSecret ? '✓ loaded' : '✗ MISSING');
  
  if (req.method === 'OPTIONS') {
    console.log('[STRIPE-WEBHOOK] Handling OPTIONS preflight');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate required secrets
    if (!stripeSecretKey) {
      console.error('[STRIPE-WEBHOOK] FATAL: Missing STRIPE_SECRET_KEY');
      return new Response(
        JSON.stringify({ error: 'Missing Stripe configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[STRIPE-WEBHOOK] FATAL: Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Initialize Stripe with Deno-compatible HTTP client
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    console.log('[STRIPE-WEBHOOK] Request details:');
    console.log('  - Signature header present:', !!signature);
    console.log('  - Body length:', body.length, 'bytes');
    console.log('  - Webhook secret configured:', !!webhookSecret);

    let event: Stripe.Event;
    
    // Verify signature if webhook secret is configured
    if (webhookSecret && signature) {
      try {
        console.log('[STRIPE-WEBHOOK] Verifying signature with constructEventAsync...');
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        console.log('[STRIPE-WEBHOOK] ✓ Signature verified successfully');
      } catch (err) {
        console.error('[STRIPE-WEBHOOK] ✗ Signature verification FAILED:', err.message);
        console.error('[STRIPE-WEBHOOK] Signature:', signature?.substring(0, 50) + '...');
        return new Response(
          JSON.stringify({ error: 'Webhook signature verification failed', details: err.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
    } else if (!webhookSecret) {
      // For testing: parse without verification (NOT recommended for production)
      console.warn('[STRIPE-WEBHOOK] ⚠ No webhook secret configured - parsing event without verification');
      try {
        event = JSON.parse(body);
        console.log('[STRIPE-WEBHOOK] Parsed event from body');
      } catch (e) {
        console.error('[STRIPE-WEBHOOK] Failed to parse event body:', e.message);
        return new Response(
          JSON.stringify({ error: 'Invalid event body' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    } else {
      console.error('[STRIPE-WEBHOOK] Missing signature header');
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('[STRIPE-WEBHOOK] Event details:');
    console.log('  - Event type:', event.type);
    console.log('  - Event ID:', event.id);
    console.log('  - Created:', new Date(event.created * 1000).toISOString());

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('[STRIPE-WEBHOOK] Processing checkout.session.completed:');
      console.log('  - Session ID:', session.id);
      console.log('  - Payment status:', session.payment_status);
      console.log('  - Payment intent:', session.payment_intent);
      console.log('  - Client reference ID:', session.client_reference_id);
      console.log('  - Metadata:', JSON.stringify(session.metadata));

      // Extract metadata - try multiple sources
      const userId = session.metadata?.userId || session.client_reference_id;
      const storeName = session.metadata?.storeName || 'Ma Boutique IA';
      const plan = session.metadata?.plan || 'starter';

      console.log('[STRIPE-WEBHOOK] Extracted data:');
      console.log('  - User ID:', userId);
      console.log('  - Store name:', storeName);
      console.log('  - Plan:', plan);

      if (!userId) {
        console.error('[STRIPE-WEBHOOK] ✗ CRITICAL: No user ID found in metadata or client_reference_id');
        // Don't throw - return success to Stripe but log the error
        return new Response(
          JSON.stringify({ received: true, warning: 'No user ID found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Find and update store by session ID
      console.log('[STRIPE-WEBHOOK] Searching for store with session ID:', session.id);
      
      const { data: existingStore, error: findError } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('stripe_checkout_session_id', session.id)
        .single();

      if (findError) {
        console.log('[STRIPE-WEBHOOK] Store not found by session ID, searching by user ID...');
        
        // Try to find by user ID
        const { data: storeByUser, error: userFindError } = await supabaseClient
          .from('store_settings')
          .select('*')
          .eq('user_id', userId)
          .eq('payment_status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (userFindError || !storeByUser) {
          console.error('[STRIPE-WEBHOOK] ✗ No pending store found for user:', userId);
          console.error('[STRIPE-WEBHOOK] Error:', userFindError?.message);
          
          // Create a new store record
          console.log('[STRIPE-WEBHOOK] Creating new store record...');
          const { data: newStore, error: createError } = await supabaseClient
            .from('store_settings')
            .insert({
              user_id: userId,
              store_name: storeName,
              store_type: 'ai',
              payment_status: 'completed',
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
              initial_products_generated: false,
            })
            .select()
            .single();

          if (createError) {
            console.error('[STRIPE-WEBHOOK] ✗ Failed to create store:', createError);
            throw createError;
          }
          
          console.log('[STRIPE-WEBHOOK] ✓ Created new store:', newStore.id);
        } else {
          // Update existing store
          console.log('[STRIPE-WEBHOOK] Found store by user ID:', storeByUser.id);
          const { error: updateError } = await supabaseClient
            .from('store_settings')
            .update({
              payment_status: 'completed',
              store_type: 'ai',
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
              updated_at: new Date().toISOString(),
            })
            .eq('id', storeByUser.id);

          if (updateError) {
            console.error('[STRIPE-WEBHOOK] ✗ Failed to update store:', updateError);
            throw updateError;
          }
          console.log('[STRIPE-WEBHOOK] ✓ Updated store payment status');
        }
      } else {
        // Store found by session ID - update it
        console.log('[STRIPE-WEBHOOK] Found store by session ID:', existingStore.id);
        
        if (existingStore.payment_status === 'completed' && existingStore.initial_products_generated) {
          console.log('[STRIPE-WEBHOOK] Store already processed - skipping');
          return new Response(
            JSON.stringify({ received: true, message: 'Already processed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }
        
        const { error: updateError } = await supabaseClient
          .from('store_settings')
          .update({
            payment_status: 'completed',
            store_type: 'ai',
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingStore.id);

        if (updateError) {
          console.error('[STRIPE-WEBHOOK] ✗ Failed to update store:', updateError);
          throw updateError;
        }
        console.log('[STRIPE-WEBHOOK] ✓ Updated store payment status to completed');
      }

      // Trigger AI store generation
      console.log('[STRIPE-WEBHOOK] Triggering generate-ai-store function...');
      const generateUrl = `${supabaseUrl}/functions/v1/generate-ai-store`;
      console.log('[STRIPE-WEBHOOK] Generate URL:', generateUrl);
      
      try {
        const generateResponse = await fetch(generateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            userId,
            storeName,
            plan,
            sessionId: session.id,
          }),
        });

        const generateResult = await generateResponse.json();
        console.log('[STRIPE-WEBHOOK] Generate response status:', generateResponse.status);
        console.log('[STRIPE-WEBHOOK] Generate result:', JSON.stringify(generateResult));

        if (!generateResponse.ok) {
          console.error('[STRIPE-WEBHOOK] ⚠ Store generation failed but continuing:', generateResult);
        } else {
          console.log('[STRIPE-WEBHOOK] ✓ Store generation triggered successfully');
        }
      } catch (genError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Error calling generate-ai-store:', genError.message);
        // Don't throw - we still want to return success to Stripe
      }

      // Update user's plan in the "Stripe" table (case-sensitive table name)
      console.log('[STRIPE-WEBHOOK] Updating Stripe table plan to:', plan);
      const { error: stripeTableError } = await supabaseClient
        .from('Stripe')
        .update({ 
          plan: plan,
          trial_expired: true
        })
        .eq('id', userId);
      
      if (stripeTableError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Error updating Stripe table:', stripeTableError.message);
      } else {
        console.log('[STRIPE-WEBHOOK] ✓ Stripe table plan updated to:', plan);
      }

      // Create notification for user
      console.log('[STRIPE-WEBHOOK] Creating user notification...');
      const { error: notifError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Paiement réussi!',
          content: `Votre paiement pour la boutique "${storeName}" (${plan}) a été confirmé. Génération en cours...`,
        });

      if (notifError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Failed to create notification:', notifError.message);
      } else {
        console.log('[STRIPE-WEBHOOK] ✓ Notification created');
      }

      const duration = Date.now() - startTime;
      console.log('[STRIPE-WEBHOOK] ✓ COMPLETE - Processing took', duration, 'ms');
      console.log('='.repeat(60));

      return new Response(
        JSON.stringify({ received: true, processed: 'checkout.session.completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // Handle payment_intent.succeeded as backup
    if (event.type === 'payment_intent.succeeded') {
      console.log('[STRIPE-WEBHOOK] payment_intent.succeeded received - typically handled via checkout.session.completed');
      return new Response(
        JSON.stringify({ received: true, processed: 'payment_intent.succeeded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Unhandled event type
    console.log('[STRIPE-WEBHOOK] Unhandled event type:', event.type);
    return new Response(
      JSON.stringify({ received: true, unhandled: event.type }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('[STRIPE-WEBHOOK] ✗ FATAL ERROR:', error.message);
    console.error('[STRIPE-WEBHOOK] Stack:', error.stack);
    
    // Return 200 to Stripe to prevent retries for application errors
    // Only return non-200 for signature verification failures
    return new Response(
      JSON.stringify({ error: error.message, received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
