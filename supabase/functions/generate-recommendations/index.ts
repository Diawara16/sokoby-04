import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseKey!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerId } = await req.json();
    console.log("Generating recommendations for customer:", customerId);

    // Récupérer l'historique des commandes du client
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          product_id,
          quantity
        )
      `)
      .eq("user_id", customerId);

    if (ordersError) throw ordersError;

    // Récupérer tous les produits
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;

    // Préparer le prompt pour l'IA
    const orderHistory = orders?.map(order => ({
      items: order.order_items,
      date: order.created_at,
      total: order.total_amount
    }));

    const prompt = `En tant qu'expert en recommandations de produits, analyse cet historique d'achats :
    ${JSON.stringify(orderHistory)}
    
    Et cette liste de produits disponibles :
    ${JSON.stringify(products)}
    
    Recommande 3 produits pertinents en te basant sur les habitudes d'achat.
    Réponds uniquement avec un tableau JSON contenant : id du produit, score de pertinence (0-1), et raison de la recommandation.`;

    // Générer les recommandations avec GPT-4
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Tu es un expert en recommandations de produits." },
          { role: "user", content: prompt }
        ],
      }),
    });

    const aiData = await aiResponse.json();
    const recommendations = JSON.parse(aiData.choices[0].message.content);

    // Sauvegarder les recommandations
    const { error: insertError } = await supabase
      .from("product_recommendations")
      .insert({
        customer_id: customerId,
        products: recommendations,
        created_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});