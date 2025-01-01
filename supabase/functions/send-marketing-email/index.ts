import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseKey!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId } = await req.json();
    console.log("Sending marketing email for campaign:", campaignId);

    // Récupérer les détails de la campagne
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError) throw campaignError;

    // Récupérer la liste des clients selon les filtres de segment
    const { data: customers, error: customersError } = await supabase
      .from("customer_details")
      .select("*")
      .eq("user_id", campaign.user_id);

    if (customersError) throw customersError;

    let emailsSent = 0;
    for (const customer of customers) {
      if (!customer.email) continue;

      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Sokoby <onboarding@resend.dev>",
            to: [customer.email],
            subject: campaign.subject,
            html: campaign.content,
          }),
        });

        if (response.ok) emailsSent++;
      } catch (error) {
        console.error("Error sending email to", customer.email, ":", error);
      }
    }

    // Mettre à jour les statistiques
    const { error: statsError } = await supabase
      .from("email_campaign_stats")
      .insert({
        campaign_id: campaignId,
        emails_sent: emailsSent,
      });

    if (statsError) throw statsError;

    // Mettre à jour le statut de la campagne
    const { error: updateError } = await supabase
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, emailsSent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending marketing emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});