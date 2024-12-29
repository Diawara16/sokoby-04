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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        // Récupérer le customer pour avoir l'email
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        if (!email) {
          throw new Error('No email found for customer');
        }

        // Récupérer l'utilisateur par email
        const { data: { users }, error: userError } = await supabaseClient.auth.admin.listUsers();
        const user = users.find(u => u.email === email);

        if (userError || !user) {
          throw new Error('User not found');
        }

        // Mettre à jour l'abonnement
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

        if (updateError) throw updateError;

        // Créer une notification
        const { error: notifError } = await supabaseClient
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Abonnement mis à jour',
            content: `Votre abonnement a été ${event.type === 'customer.subscription.created' ? 'créé' : 'mis à jour'} avec succès.`
          });

        if (notifError) throw notifError;
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Mettre à jour le statut de l'abonnement
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) throw updateError;

        // Créer une notification
        const { data: subData } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (subData) {
          const { error: notifError } = await supabaseClient
            .from('notifications')
            .insert({
              user_id: subData.user_id,
              title: 'Abonnement annulé',
              content: 'Votre abonnement a été annulé. Nous espérons vous revoir bientôt !'
            });

          if (notifError) throw notifError;
        }
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