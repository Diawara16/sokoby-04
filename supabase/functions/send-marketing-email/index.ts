
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  campaignId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { campaignId }: EmailRequest = await req.json();
    console.log("Sending marketing email for campaign:", campaignId);

    // Récupérer les détails de la campagne et vérifier que l'utilisateur en est le propriétaire
    const { data: campaign, error: campaignError } = await supabaseClient
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", userData.user.id) // Sécurité: vérifier que l'utilisateur possède la campagne
      .single();

    if (campaignError || !campaign) {
      return new Response(JSON.stringify({ error: "Campaign not found or access denied" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Récupérer la liste des clients selon les filtres de segment
    const { data: customers, error: customersError } = await supabaseClient
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
    const { error: statsError } = await supabaseClient
      .from("email_campaign_stats")
      .insert({
        campaign_id: campaignId,
        emails_sent: emailsSent,
      });

    if (statsError) throw statsError;

    // Mettre à jour le statut de la campagne
    const { error: updateError } = await supabaseClient
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
};

serve(handler);
