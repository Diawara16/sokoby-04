import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PRICE-CHANGE-NOTIFICATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const resend = new Resend(resendKey);

    // Récupérer tous les utilisateurs avec des abonnements actifs
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('subscriptions')
      .select(`
        *,
        profiles!inner(email, id)
      `)
      .eq('status', 'active');

    if (subsError) {
      logStep("Error fetching subscriptions", subsError);
      throw new Error(`Error fetching subscriptions: ${subsError.message}`);
    }

    logStep("Found active subscriptions", { count: subscriptions?.length || 0 });

    const notifications = [];
    const emailPromises = [];

    for (const subscription of subscriptions || []) {
      const userEmail = subscription.profiles.email;
      const planName = subscription.plan_type === 'starter' ? 'Essentiel' : 
                      subscription.plan_type === 'pro' ? 'Pro' : 'Premium';
      
      const currentPrice = subscription.plan_type === 'starter' ? '11€' : 
                          subscription.plan_type === 'pro' ? '25€' : '97€';
      
      const newPrice = subscription.plan_type === 'starter' ? '19€' : 
                      subscription.plan_type === 'pro' ? '39€' : '119€';

      // Créer une notification dans la base de données
      const { error: notifError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: subscription.user_id,
          title: 'Modification de tarifs - Préavis important',
          content: `Nous vous informons que les tarifs de votre abonnement ${planName} évolueront de ${currentPrice} à ${newPrice}/mois à partir du ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}. Cette modification respecte le préavis légal de 30 jours. Vous pouvez à tout moment modifier ou annuler votre abonnement depuis votre espace client.`,
          type: 'price_change'
        });

      if (notifError) {
        logStep("Error creating notification", { userId: subscription.user_id, error: notifError });
      } else {
        notifications.push(subscription.user_id);
      }

      // Envoyer un email de notification
      const emailPromise = resend.emails.send({
        from: "Sokoby <noreply@sokoby.com>",
        to: [userEmail],
        subject: "Modification de tarifs - Préavis important",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Modification de nos tarifs</h1>
            
            <p>Cher(e) client(e),</p>
            
            <p>Nous vous informons d'une évolution de nos tarifs qui prendra effet dans <strong>30 jours</strong>, conformément à la réglementation en vigueur.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Votre abonnement ${planName}</h3>
              <p style="margin: 10px 0;"><strong>Tarif actuel :</strong> ${currentPrice}/mois</p>
              <p style="margin: 10px 0;"><strong>Nouveau tarif :</strong> ${newPrice}/mois</p>
              <p style="margin: 10px 0;"><strong>Date d'application :</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <p>Cette augmentation nous permet de continuer à améliorer nos services et d'investir dans de nouvelles fonctionnalités pour mieux répondre à vos besoins.</p>
            
            <h3>Vos options :</h3>
            <ul>
              <li>Continuer avec votre abonnement actuel au nouveau tarif</li>
              <li>Changer de plan pour mieux correspondre à vos besoins</li>
              <li>Annuler votre abonnement avant la date d'application</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://sokoby.com/dashboard/subscription" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Gérer mon abonnement
              </a>
            </div>
            
            <p>Si vous avez des questions, notre équipe support reste à votre disposition.</p>
            
            <p>Merci pour votre confiance,<br>
            L'équipe Sokoby</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              Conformément à l'article L. 215-1 du Code de la consommation, vous disposez d'un délai de 30 jours pour accepter ou refuser cette modification.
            </p>
          </div>
        `,
      });

      emailPromises.push(emailPromise);
    }

    // Attendre que tous les emails soient envoyés
    const emailResults = await Promise.allSettled(emailPromises);
    const successfulEmails = emailResults.filter(result => result.status === 'fulfilled').length;
    const failedEmails = emailResults.filter(result => result.status === 'rejected').length;

    logStep("Email sending completed", { 
      total: emailResults.length, 
      successful: successfulEmails, 
      failed: failedEmails 
    });

    return new Response(JSON.stringify({ 
      success: true,
      notificationsSent: notifications.length,
      emailsSent: successfulEmails,
      emailsFailed: failedEmails,
      message: `Notifications envoyées à ${notifications.length} utilisateurs`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in price change notification", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});