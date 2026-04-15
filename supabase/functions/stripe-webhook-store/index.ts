import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  const startTime = Date.now();
  console.log('[STRIPE-WEBHOOK] START:', new Date().toISOString());

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey || !webhookSecret) {
      console.error('[STRIPE-WEBHOOK] FATAL: Missing required env vars');
      return new Response(
        JSON.stringify({ error: 'Missing configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('[STRIPE-WEBHOOK] Signature verification FAILED:', err.message);
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('[STRIPE-WEBHOOK] Event:', event.type, '| ID:', event.id, '| Livemode:', event.livemode);

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // ================================================================
    // IDEMPOTENCY: Check if this event was already processed
    // ================================================================
    const { data: existingEvent } = await supabaseClient
      .from('subscription_events')
      .select('id')
      .eq('stripe_event_id', event.id)
      .maybeSingle();

    if (existingEvent) {
      console.log('[STRIPE-WEBHOOK] Event already processed (idempotent skip):', event.id);
      return new Response(
        JSON.stringify({ received: true, skipped: 'already_processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // ================================================================
    // EVENT ROUTER — single handler per event type
    // ================================================================
    switch (event.type) {
      case 'checkout.session.completed':
        return await handleCheckoutCompleted(event, stripe, supabaseClient, supabaseUrl, supabaseServiceKey, stripeSecretKey, startTime);

      case 'invoice.paid':
        return await handleInvoicePaid(event, stripe, supabaseClient, stripeSecretKey);

      case 'invoice.payment_failed':
        return await handlePaymentFailed(event, supabaseClient);

      case 'customer.subscription.updated':
        return await handleSubscriptionUpdated(event, supabaseClient);

      case 'customer.subscription.deleted':
        return await handleSubscriptionDeleted(event, supabaseClient);

      default:
        console.log('[STRIPE-WEBHOOK] Unhandled event type:', event.type);
        return jsonResponse({ received: true, unhandled: event.type });
    }
  } catch (error) {
    console.error('[STRIPE-WEBHOOK] FATAL ERROR:', error.message);
    return new Response(
      JSON.stringify({ error: error.message, received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});

// ================================================================
// HELPERS
// ================================================================

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status
  });
}

async function logSubscriptionEvent(supabaseClient: any, storeId: string, eventType: string, metadata: any, stripeEventId?: string) {
  await supabaseClient.from('subscription_events').insert({
    store_id: storeId,
    event_type: eventType,
    metadata,
    ...(stripeEventId ? { stripe_event_id: stripeEventId } : {}),
  });
}

// ================================================================
// checkout.session.completed
// Routes to store creation OR subscription activation based on metadata
// ================================================================
async function handleCheckoutCompleted(
  event: any, stripe: any, supabaseClient: any,
  supabaseUrl: string, supabaseServiceKey: string, stripeSecretKey: string, startTime: number
) {
  const session = event.data.object;

  // ROUTE 1: Store subscription checkout
  if (session.metadata?.type === 'store_subscription' && session.mode === 'subscription') {
    return await processSubscriptionCheckout(session, stripe, supabaseClient, stripeSecretKey, event.id);
  }

  // ROUTE 2: Store creation checkout (one-time payment)
  return await processStoreCreationCheckout(session, supabaseClient, supabaseUrl, supabaseServiceKey, stripeSecretKey, startTime, event.id);
}

// ================================================================
// STORE SUBSCRIPTION CHECKOUT
// ================================================================
async function processSubscriptionCheckout(session: any, stripe: any, supabaseClient: any, stripeSecretKey: string, stripeEventId: string) {
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

  // Single Stripe API call to get subscription details
  let renewalDate: string | null = null;
  let isTrial = false;
  let trialEndDate: string | null = null;

  try {
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
    renewalDate = new Date(stripeSub.current_period_end * 1000).toISOString();
    if (stripeSub.status === 'trialing' && stripeSub.trial_end) {
      isTrial = true;
      trialEndDate = new Date(stripeSub.trial_end * 1000).toISOString();
      console.log('[STRIPE-WEBHOOK] Trial detected, ends:', trialEndDate);
    }
  } catch (e) {
    console.error('[STRIPE-WEBHOOK] Failed to fetch subscription details:', e.message);
  }

  // Create new subscription record
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

  await logSubscriptionEvent(supabaseClient, storeId, 'plan_activated', {
    plan_slug: planSlug, plan_id: planId, billing_cycle: billingCycle,
    stripe_subscription_id: stripeSubId,
  }, stripeEventId);

  return jsonResponse({ received: true, processed: 'store_subscription_activated' });
}

// ================================================================
// STORE CREATION CHECKOUT (one-time payment)
// ================================================================
async function processStoreCreationCheckout(
  session: any, supabaseClient: any,
  supabaseUrl: string, supabaseServiceKey: string, stripeSecretKey: string, startTime: number, stripeEventId: string
) {
  if (session.payment_status !== 'paid') {
    console.log('[STRIPE-WEBHOOK] Payment not completed:', session.payment_status);
    return jsonResponse({ received: true, warning: 'Payment not completed' });
  }

  let userId = session.metadata?.userId || session.client_reference_id;
  const storeName = session.metadata?.storeName || 'Ma Boutique IA';
  const plan = session.metadata?.plan || 'starter';
  const niche = session.metadata?.niche || 'general';
  const storeIdFromMeta = session.metadata?.storeId;
  const customerEmail = session.customer_details?.email || session.customer_email;
  const stripeCustomerId = session.customer as string;

  // Fallback: find userId by email
  if (!userId && customerEmail) {
    const { data: profileByEmail } = await supabaseClient
      .from('profiles').select('id').eq('email', customerEmail).maybeSingle();
    if (profileByEmail) userId = profileByEmail.id;
  }

  if (!userId) {
    console.error('[STRIPE-WEBHOOK] No user ID found');
    return jsonResponse({ received: true, warning: 'No user ID found' });
  }

  // Store lookup priority: metadata storeId → stripe_customer_id → session_id → user_id
  let existingStore: any = null;

  if (storeIdFromMeta) {
    const { data } = await supabaseClient.from('store_settings').select('*').eq('id', storeIdFromMeta).single();
    if (data) existingStore = data;
  }
  if (!existingStore && stripeCustomerId) {
    const { data } = await supabaseClient.from('store_settings').select('*')
      .eq('stripe_customer_id', stripeCustomerId).in('payment_status', ['pending', 'processing'])
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (data) existingStore = data;
  }
  if (!existingStore) {
    const { data } = await supabaseClient.from('store_settings').select('*')
      .eq('stripe_checkout_session_id', session.id).maybeSingle();
    if (data) existingStore = data;
  }
  if (!existingStore) {
    const { data } = await supabaseClient.from('store_settings').select('*')
      .eq('user_id', userId).in('payment_status', ['pending', 'processing'])
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (data) existingStore = data;
  }

  let storeId: string;

  if (existingStore) {
    storeId = existingStore.id;
    // Idempotent: skip if already processed
    if (existingStore.payment_status === 'completed' && existingStore.initial_products_generated && existingStore.is_production) {
      console.log('[STRIPE-WEBHOOK] Store already PRODUCTION - skipping');
      return jsonResponse({ received: true, message: 'Already processed' });
    }

    await supabaseClient.from('store_settings').update({
      payment_status: 'completed', store_status: 'processing', store_type: 'ai',
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: stripeCustomerId || existingStore.stripe_customer_id,
      niche, updated_at: new Date().toISOString(),
    }).eq('id', storeId);
  } else {
    const { data: newStore, error: createError } = await supabaseClient
      .from('store_settings').insert({
        user_id: userId, store_name: storeName, store_type: 'ai',
        payment_status: 'completed', store_status: 'processing', is_production: false,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_customer_id: stripeCustomerId || null,
        initial_products_generated: false, niche,
      }).select().single();

    if (createError) throw createError;
    storeId = newStore.id;
  }

  // Trigger AI store generation
  try {
    const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-ai-store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseServiceKey}` },
      body: JSON.stringify({ userId, storeName, plan, niche, sessionId: session.id, storeId, isProduction: true, forceRegenerate: true }),
    });
    const generateResult = await generateResponse.json();
    if (!generateResponse.ok) {
      console.error('[STRIPE-WEBHOOK] Store generation failed:', generateResult);
    }
  } catch (genError) {
    console.error('[STRIPE-WEBHOOK] Error calling generate-ai-store:', genError.message);
  }

  // Update auxiliary tables (Stripe table, stores table, profiles)
  await supabaseClient.from('Stripe').upsert({ id: userId, email: customerEmail || '', plan, trial_expired: true }, { onConflict: 'id' });

  await supabaseClient.from('stores').upsert({
    owner_id: userId, user_id: userId, store_name: storeName, niche,
    plan: plan === 'starter' || plan === 'pro' || plan === 'enterprise' ? 'paid' : plan,
    status: 'active', billing_status: 'active', trial_ends_at: null,
    owner_email: customerEmail || null, paid_at: new Date().toISOString(),
  }, { onConflict: 'owner_id' });

  await supabaseClient.from('profiles').update({ trial_ends_at: null }).eq('id', userId);

  await supabaseClient.from('notifications').insert({
    user_id: userId,
    title: 'Paiement confirmé - Boutique LIVE!',
    content: `Votre paiement pour la boutique "${storeName}" (${plan}) a été confirmé. Votre boutique de production est en cours de création...`,
  });

  console.log('[STRIPE-WEBHOOK] ✓ Store creation complete in', Date.now() - startTime, 'ms');
  return jsonResponse({ received: true, processed: 'checkout.session.completed', production: true });
}

// ================================================================
// invoice.paid — renew/confirm subscription
// ================================================================
async function handleInvoicePaid(event: any, stripe: any, supabaseClient: any, stripeSecretKey: string) {
  const invoice = event.data.object;
  const stripeSubId = invoice.subscription as string;

  if (!stripeSubId) {
    return jsonResponse({ received: true, processed: 'invoice_paid_no_sub' });
  }

  console.log('[STRIPE-WEBHOOK] invoice.paid for subscription:', stripeSubId);

  // Include 'canceling' — a paid invoice during grace period reactivates
  const { data: existingSub } = await supabaseClient
    .from('store_subscriptions')
    .select('id, store_id, status')
    .eq('stripe_subscription_id', stripeSubId)
    .in('status', ['active', 'trial', 'canceling'])
    .maybeSingle();

  if (existingSub) {
    let renewalDate: string | null = null;
    try {
      const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
      renewalDate = new Date(stripeSub.current_period_end * 1000).toISOString();
    } catch (e) {
      console.error('[STRIPE-WEBHOOK] Failed to fetch sub for renewal:', e.message);
    }

    if (renewalDate) {
      await supabaseClient.from('store_subscriptions')
        .update({ renewal_date: renewalDate, status: 'active' })
        .eq('id', existingSub.id);
    }

    await logSubscriptionEvent(supabaseClient, existingSub.store_id, 'invoice_paid', {
      stripe_subscription_id: stripeSubId, renewal_date: renewalDate,
    }, event.id);

    console.log('[STRIPE-WEBHOOK] ✓ Subscription renewed:', existingSub.id);
  }

  return jsonResponse({ received: true, processed: 'invoice_paid' });
}

// ================================================================
// invoice.payment_failed — log only, Stripe handles retries
// ================================================================
async function handlePaymentFailed(event: any, supabaseClient: any) {
  const invoice = event.data.object;
  const stripeSubId = invoice.subscription as string;

  if (!stripeSubId) {
    return jsonResponse({ received: true, processed: 'payment_failed_no_sub' });
  }

  console.log('[STRIPE-WEBHOOK] Payment failed for subscription:', stripeSubId);

  const { data: existingSub } = await supabaseClient
    .from('store_subscriptions')
    .select('id, store_id')
    .eq('stripe_subscription_id', stripeSubId)
    .maybeSingle();

  if (existingSub) {
    await logSubscriptionEvent(supabaseClient, existingSub.store_id, 'payment_failed', {
      stripe_subscription_id: stripeSubId, attempt_count: invoice.attempt_count,
    }, event.id);
    console.log('[STRIPE-WEBHOOK] ✓ Payment failure logged (Stripe retries)');
  }

  return jsonResponse({ received: true, processed: 'payment_failed' });
}

// ================================================================
// customer.subscription.updated — canceling, reactivation, plan change
// ================================================================
async function handleSubscriptionUpdated(event: any, supabaseClient: any) {
  const subscription = event.data.object;
  const stripeSubId = subscription.id;

  console.log('[STRIPE-WEBHOOK] Subscription updated:', stripeSubId, {
    status: subscription.status, cancel_at_period_end: subscription.cancel_at_period_end,
  });

  const { data: existingSub } = await supabaseClient
    .from('store_subscriptions')
    .select('id, store_id, status')
    .eq('stripe_subscription_id', stripeSubId)
    .maybeSingle();

  if (existingSub) {
    const updates: any = {};

    // Cancel at period end → grace period
    if (subscription.cancel_at_period_end && subscription.status === 'active') {
      updates.status = 'canceling';
      updates.canceled_at = new Date().toISOString();
      updates.end_date = new Date(subscription.current_period_end * 1000).toISOString();
    }
    // Reactivated (undid cancellation)
    else if (!subscription.cancel_at_period_end && subscription.status === 'active' && existingSub.status === 'canceling') {
      updates.status = 'active';
      updates.canceled_at = null;
    }

    // Always update renewal date if available
    if (subscription.current_period_end) {
      updates.renewal_date = new Date(subscription.current_period_end * 1000).toISOString();
    }

    if (Object.keys(updates).length > 0) {
      await supabaseClient.from('store_subscriptions').update(updates).eq('id', existingSub.id);
    }

    await logSubscriptionEvent(supabaseClient, existingSub.store_id, 'subscription_updated', {
      stripe_subscription_id: stripeSubId,
      cancel_at_period_end: subscription.cancel_at_period_end,
      status: subscription.status, updates,
    }, event.id);
  }

  return jsonResponse({ received: true, processed: 'subscription_updated' });
}

// ================================================================
// customer.subscription.deleted — expired, store stays active
// ================================================================
async function handleSubscriptionDeleted(event: any, supabaseClient: any) {
  const subscription = event.data.object;
  const stripeSubId = subscription.id;

  console.log('[STRIPE-WEBHOOK] Subscription deleted:', stripeSubId);

  const { data: existingSub } = await supabaseClient
    .from('store_subscriptions')
    .select('id, store_id')
    .eq('stripe_subscription_id', stripeSubId)
    .maybeSingle();

  if (existingSub) {
    await supabaseClient.from('store_subscriptions')
      .update({ status: 'expired', canceled_at: new Date().toISOString() })
      .eq('id', existingSub.id);

    await logSubscriptionEvent(supabaseClient, existingSub.store_id, 'subscription_expired', {
      stripe_subscription_id: stripeSubId,
    }, event.id);

    console.log('[STRIPE-WEBHOOK] ✓ Subscription expired (store stays active):', existingSub.id);
  }

  return jsonResponse({ received: true, processed: 'subscription_deleted' });
}
