import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Return {
  id: string;
  order_id: string;
  reason: string;
  status: string;
  automated_status: string;
  processing_notes: string[];
  tracking_number: string | null;
}

const processReturn = async (returnData: Return) => {
  const notes: string[] = [];
  let newStatus = returnData.automated_status;

  // Vérifier si le numéro de suivi est valide
  if (returnData.tracking_number) {
    notes.push("Numéro de suivi validé");
    newStatus = "processing";
  }

  // Analyser la raison du retour
  const validReasons = ["defective", "wrong_item", "not_as_described", "size_issue"];
  if (validReasons.includes(returnData.reason.toLowerCase())) {
    notes.push("Raison du retour validée");
    newStatus = "approved";
  } else {
    notes.push("Raison du retour nécessite une revue manuelle");
    newStatus = "manual_review";
  }

  return {
    status: newStatus,
    notes,
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Récupérer les retours en attente
    const { data: returns, error: fetchError } = await supabaseClient
      .from("returns")
      .select("*")
      .eq("automated_status", "pending");

    if (fetchError) throw fetchError;

    // Traiter chaque retour
    const processedReturns = await Promise.all(
      returns.map(async (returnItem: Return) => {
        const { status, notes } = await processReturn(returnItem);

        // Mettre à jour le retour dans la base de données
        const { error: updateError } = await supabaseClient
          .from("returns")
          .update({
            automated_status: status,
            processing_notes: notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", returnItem.id);

        if (updateError) throw updateError;

        // Créer une notification pour l'utilisateur
        await supabaseClient.from("notifications").insert({
          user_id: returnItem.user_id,
          title: "Mise à jour du retour",
          content: `Le statut de votre retour a été mis à jour : ${status}`,
        });

        return {
          id: returnItem.id,
          status,
          notes,
        };
      })
    );

    return new Response(JSON.stringify({ processed: processedReturns }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing returns:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});