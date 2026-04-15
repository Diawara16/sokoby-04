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
    
    // PRODUCTION MODE: Always verify signature with webhook secret
    if (!webhookSecret) {
      console.error('[STRIPE-WEBHOOK] FATAL: STRIPE_WEBHOOK_SECRET not configured - required for LIVE mode');
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!signature) {
      console.error('[STRIPE-WEBHOOK] FATAL: Missing stripe-signature header');
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    try {
      console.log('[STRIPE-WEBHOOK] Verifying signature with constructEventAsync...');
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      console.log('[STRIPE-WEBHOOK] ✓ Signature verified successfully - LIVE payment confirmed');
    } catch (err) {
      console.error('[STRIPE-WEBHOOK] ✗ Signature verification FAILED:', err.message);
      console.error('[STRIPE-WEBHOOK] Signature:', signature?.substring(0, 50) + '...');
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed', details: err.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('[STRIPE-WEBHOOK] Event details:');
    console.log('  - Event type:', event.type);
    console.log('  - Event ID:', event.id);
    console.log('  - Created:', new Date(event.created * 1000).toISOString());
    console.log('  - Livemode:', event.livemode);

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
      console.log('  - Livemode:', session.livemode);

      // CRITICAL: Verify payment is actually completed
      if (session.payment_status !== 'paid') {
        console.error('[STRIPE-WEBHOOK] ✗ Payment not completed - status:', session.payment_status);
        return new Response(
          JSON.stringify({ received: true, warning: 'Payment not completed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Extract metadata - try multiple sources
      let userId = session.metadata?.userId || session.client_reference_id;
      const storeName = session.metadata?.storeName || 'Ma Boutique IA';
      const plan = session.metadata?.plan || 'starter';
      const niche = session.metadata?.niche || 'general';
      const storeIdFromMeta = session.metadata?.storeId;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const stripeCustomerId = session.customer as string;

      console.log('[STRIPE-WEBHOOK] Extracted data:');
      console.log('  - User ID:', userId);
      console.log('  - Customer email:', customerEmail);
      console.log('  - Store name:', storeName);
      console.log('  - Plan:', plan);
      console.log('  - Niche:', niche);
      console.log('  - Store ID from metadata:', storeIdFromMeta);
      console.log('  - Stripe customer ID:', stripeCustomerId);

      // Fallback: find userId by email if not in metadata
      if (!userId && customerEmail) {
        console.log('[STRIPE-WEBHOOK] No userId in metadata, looking up by email:', customerEmail);
        const { data: profileByEmail } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .maybeSingle();
        if (profileByEmail) {
          userId = profileByEmail.id;
          console.log('[STRIPE-WEBHOOK] ✓ Found userId by email:', userId);
        }
      }

      if (!userId) {
        console.error('[STRIPE-WEBHOOK] ✗ CRITICAL: No user ID found in metadata, client_reference_id, or email lookup');
        return new Response(
          JSON.stringify({ received: true, warning: 'No user ID found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // === STORE LOOKUP PRIORITY ===
      // 1. By storeId from metadata (most precise for multi-store users)
      // 2. By stripe_customer_id on the store record
      // 3. By stripe_checkout_session_id
      // 4. Fallback: by user_id with pending payment status
      let existingStore: any = null;
      let storeId: string;

      // 1. Try storeId from metadata
      if (storeIdFromMeta) {
        console.log('[STRIPE-WEBHOOK] Looking up store by metadata storeId:', storeIdFromMeta);
        const { data } = await supabaseClient
          .from('store_settings')
          .select('*')
          .eq('id', storeIdFromMeta)
          .single();
        if (data) existingStore = data;
      }

      // 2. Try stripe_customer_id
      if (!existingStore && stripeCustomerId) {
        console.log('[STRIPE-WEBHOOK] Looking up store by stripe_customer_id:', stripeCustomerId);
        const { data } = await supabaseClient
          .from('store_settings')
          .select('*')
          .eq('stripe_customer_id', stripeCustomerId)
          .in('payment_status', ['pending', 'processing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) existingStore = data;
      }

      // 3. Try session ID
      if (!existingStore) {
        console.log('[STRIPE-WEBHOOK] Looking up store by session ID:', session.id);
        const { data } = await supabaseClient
          .from('store_settings')
          .select('*')
          .eq('stripe_checkout_session_id', session.id)
          .maybeSingle();
        if (data) existingStore = data;
      }

      // 4. Fallback: by user_id with pending status
      if (!existingStore) {
        console.log('[STRIPE-WEBHOOK] Looking up store by user_id with pending status...');
        const { data } = await supabaseClient
          .from('store_settings')
          .select('*')
          .eq('user_id', userId)
          .in('payment_status', ['pending', 'processing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) existingStore = data;
      }

      if (existingStore) {
        storeId = existingStore.id;
        console.log('[STRIPE-WEBHOOK] ✓ Found store:', storeId);

        // Skip if already fully processed
        if (existingStore.payment_status === 'completed' && existingStore.initial_products_generated && existingStore.is_production) {
          console.log('[STRIPE-WEBHOOK] Store already PRODUCTION - skipping');
          return new Response(
            JSON.stringify({ received: true, message: 'Already processed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }

        // Update store to completed + save stripe IDs
        const { error: updateError } = await supabaseClient
          .from('store_settings')
          .update({
            payment_status: 'completed',
            store_status: 'processing',
            store_type: 'ai',
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_customer_id: stripeCustomerId || existingStore.stripe_customer_id,
            niche: niche,
            updated_at: new Date().toISOString(),
          })
          .eq('id', storeId);

        if (updateError) {
          console.error('[STRIPE-WEBHOOK] ✗ Failed to update store:', updateError);
          throw updateError;
        }
        console.log('[STRIPE-WEBHOOK] ✓ Updated store to PROCESSING status');
      } else {
        console.log('[STRIPE-WEBHOOK] No existing store found - creating new PRODUCTION store');

        const { data: newStore, error: createError } = await supabaseClient
          .from('store_settings')
          .insert({
            user_id: userId,
            store_name: storeName,
            store_type: 'ai',
            payment_status: 'completed',
            store_status: 'processing',
            is_production: false,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_customer_id: stripeCustomerId || null,
            initial_products_generated: false,
            niche: niche,
          })
          .select()
          .single();

        if (createError) {
          console.error('[STRIPE-WEBHOOK] ✗ Failed to create store:', createError);
          throw createError;
        }

        storeId = newStore.id;
        console.log('[STRIPE-WEBHOOK] ✓ Created new PRODUCTION store:', storeId);
      }

      // Trigger AI store generation for PRODUCTION
      console.log('[STRIPE-WEBHOOK] Triggering generate-ai-store function for PRODUCTION...');
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
            niche,  // Pass niche to generator
            sessionId: session.id,
            storeId,
            isProduction: true, // CRITICAL: Flag for production mode
            forceRegenerate: true, // Always force purge of old products on webhook
          }),
        });

        const generateResult = await generateResponse.json();
        console.log('[STRIPE-WEBHOOK] Generate response status:', generateResponse.status);
        console.log('[STRIPE-WEBHOOK] Generate result:', JSON.stringify(generateResult));

        if (!generateResponse.ok) {
          console.error('[STRIPE-WEBHOOK] ⚠ Store generation failed but continuing:', generateResult);
        } else {
          console.log('[STRIPE-WEBHOOK] ✓ PRODUCTION store generation triggered successfully');
        }
      } catch (genError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Error calling generate-ai-store:', genError.message);
        // Don't throw - we still want to return success to Stripe
      }

      // Update user's plan in the "Stripe" table (case-sensitive table name) — use UPSERT
      console.log('[STRIPE-WEBHOOK] Upserting Stripe table plan to:', plan);
      const { error: stripeTableError } = await supabaseClient
        .from('Stripe')
        .upsert({ 
          id: userId,
          email: customerEmail || '',
          plan: plan,
          trial_expired: true
        }, { onConflict: 'id' });
      
      if (stripeTableError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Error upserting Stripe table:', stripeTableError.message);
      } else {
        console.log('[STRIPE-WEBHOOK] ✓ Stripe table plan upserted to:', plan);
      }

      // === CRITICAL: Update stores table (single source of truth for access control) ===
      console.log('[STRIPE-WEBHOOK] Upserting stores table with plan:', plan);
      const { error: storesUpsertError } = await supabaseClient
        .from('stores')
        .upsert({
          owner_id: userId,
          user_id: userId,
          store_name: storeName,
          niche: niche,
          plan: plan === 'starter' || plan === 'pro' || plan === 'enterprise' ? 'paid' : plan,
          status: 'active',
          billing_status: 'active',
          trial_ends_at: null,
          owner_email: customerEmail || null,
          paid_at: new Date().toISOString(),
        }, { onConflict: 'owner_id' });

      if (storesUpsertError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Error upserting stores table:', storesUpsertError.message);
      } else {
        console.log('[STRIPE-WEBHOOK] ✓ stores table updated: plan=paid, status=active');
      }

      // Also clear trial_ends_at in profiles so access control sees paid status
      console.log('[STRIPE-WEBHOOK] Clearing trial_ends_at in profiles for userId:', userId);
      const { error: profileUpdateError } = await supabaseClient
        .from('profiles')
        .update({ trial_ends_at: null })
        .eq('id', userId);
      
      if (profileUpdateError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Error clearing trial_ends_at:', profileUpdateError.message);
      } else {
        console.log('[STRIPE-WEBHOOK] ✓ trial_ends_at cleared for paid user');
      }

      // Create notification for user
      console.log('[STRIPE-WEBHOOK] Creating user notification...');
      const { error: notifError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Paiement confirmé - Boutique LIVE!',
          content: `Votre paiement pour la boutique "${storeName}" (${plan}) a été confirmé. Votre boutique de production est en cours de création...`,
        });

      if (notifError) {
        console.error('[STRIPE-WEBHOOK] ⚠ Failed to create notification:', notifError.message);
      } else {
        console.log('[STRIPE-WEBHOOK] ✓ Notification created');
      }

      const duration = Date.now() - startTime;
      console.log('[STRIPE-WEBHOOK] ✓ COMPLETE - PRODUCTION processing took', duration, 'ms');
      console.log('='.repeat(60));

      return new Response(
        JSON.stringify({ received: true, processed: 'checkout.session.completed', production: true }),
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

    // ============================================================
    // STORE SUBSCRIPTION EVENTS (separate from store creation)
    // ============================================================

    // Handle subscription checkout completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      // Only process store_subscription type checkouts
      if (session.metadata?.type === 'store_subscription' && session.mode === 'subscription') {
        const storeId = session.metadata.store_id;
        const planId = session.metadata.plan_id;
        const planSlug = session.metadata.plan_slug;
        const billingCycle = session.metadata.billing_cycle || 'monthly';
        const stripeSubId = session.subscription as string;

        console.log('[STRIPE-WEBHOOK] Processing store_subscription checkout:', { storeId, planId, planSlug, stripeSubId });

        // Cancel existing active subscriptions for this store
        const now = new Date().toISOString();
        await supabaseClient
          .from('store_subscriptions')
          .update({ status: 'canceled', canceled_at: now })
          .eq('store_id', storeId)
          .in('status', ['active', 'trial']);

        // Get Stripe subscription details for renewal date
        let renewalDate: string | null = null;
        try {
          const stripe2 = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
          const stripeSub = await stripe2.subscriptions.retrieve(stripeSubId);
          renewalDate = new Date(stripeSub.current_period_end * 1000).toISOString();
        } catch (e) {
          console.error('[STRIPE-WEBHOOK] Failed to fetch subscription details:', e.message);
        }

        // Determine if this is a trial subscription
        let isTrial = false;
        let trialEndDate: string | null = null;
        try {
          const stripe3 = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
          const stripeSub = await stripe3.subscriptions.retrieve(stripeSubId);
          if (stripeSub.status === 'trialing' && stripeSub.trial_end) {
            isTrial = true;
            trialEndDate = new Date(stripeSub.trial_end * 1000).toISOString();
            console.log('[STRIPE-WEBHOOK] Trial detected, ends:', trialEndDate);
          }
        } catch (e) {
          console.error('[STRIPE-WEBHOOK] Failed to check trial status:', e.message);
        }

        // Create new subscription (trial or active)
        const { error: subError } = await supabaseClient
          .from('store_subscriptions')
          .insert({
            store_id: storeId,
            plan_id: planId,
            status: isTrial ? 'trial' : 'active',
            billing_cycle: billingCycle,
            start_date: now,
            end_date: trialEndDate,
            renewal_date: renewalDate || trialEndDate,
            stripe_subscription_id: stripeSubId,
          });

        if (subError) {
          console.error('[STRIPE-WEBHOOK] Failed to create store_subscription:', subError);
        } else {
          console.log('[STRIPE-WEBHOOK] ✓ store_subscription activated:', { storeId, planSlug });
        }

        // Log subscription event
        await supabaseClient.from('subscription_events').insert({
          store_id: storeId,
          event_type: 'plan_activated',
          metadata: { plan_slug: planSlug, plan_id: planId, billing_cycle: billingCycle, stripe_subscription_id: stripeSubId },
        });

        return new Response(
          JSON.stringify({ received: true, processed: 'store_subscription_activated' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }

    // Handle invoice.paid — renew/confirm subscription
    if (event.type === 'invoice.paid') {
      const invoice = event.data.object as any;
      const stripeSubId = invoice.subscription as string;

      if (stripeSubId) {
        console.log('[STRIPE-WEBHOOK] invoice.paid for subscription:', stripeSubId);

        // Update renewal date on existing subscription
        const { data: existingSub } = await supabaseClient
          .from('store_subscriptions')
          .select('id, store_id')
          .eq('stripe_subscription_id', stripeSubId)
          .eq('status', 'active')
          .maybeSingle();

        if (existingSub) {
          let renewalDate: string | null = null;
          try {
            const stripe2 = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
            const stripeSub = await stripe2.subscriptions.retrieve(stripeSubId);
            renewalDate = new Date(stripeSub.current_period_end * 1000).toISOString();
          } catch (e) {
            console.error('[STRIPE-WEBHOOK] Failed to fetch sub for renewal:', e.message);
          }

          if (renewalDate) {
            await supabaseClient
              .from('store_subscriptions')
              .update({ renewal_date: renewalDate, status: 'active' })
              .eq('id', existingSub.id);
          }

          await supabaseClient.from('subscription_events').insert({
            store_id: existingSub.store_id,
            event_type: 'invoice_paid',
            metadata: { stripe_subscription_id: stripeSubId, renewal_date: renewalDate },
          });

          console.log('[STRIPE-WEBHOOK] ✓ Subscription renewed:', existingSub.id);
        }

        return new Response(
          JSON.stringify({ received: true, processed: 'invoice_paid' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any;
      const stripeSubId = subscription.id;

      console.log('[STRIPE-WEBHOOK] Subscription deleted:', stripeSubId);

      const { data: existingSub } = await supabaseClient
        .from('store_subscriptions')
        .select('id, store_id')
        .eq('stripe_subscription_id', stripeSubId)
        .maybeSingle();

      if (existingSub) {
        const now = new Date().toISOString();
        await supabaseClient
          .from('store_subscriptions')
          .update({ status: 'canceled', canceled_at: now })
          .eq('id', existingSub.id);

        await supabaseClient.from('subscription_events').insert({
          store_id: existingSub.store_id,
          event_type: 'subscription_canceled',
          metadata: { stripe_subscription_id: stripeSubId },
        });

        console.log('[STRIPE-WEBHOOK] ✓ Subscription canceled:', existingSub.id);
      }

      return new Response(
        JSON.stringify({ received: true, processed: 'subscription_deleted' }),
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