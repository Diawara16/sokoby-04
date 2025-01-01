import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion du CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Création du client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Récupération de l'utilisateur authentifié
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) throw new Error('No authorization header')
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError || !user) throw new Error('User not authenticated')

    // Récupérer l'historique des ventes des 6 derniers mois
    const { data: orders, error: ordersError } = await supabaseClient
      .from('orders')
      .select('total_amount, created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      throw ordersError
    }

    // Formater les données pour l'IA
    const salesData = orders.reduce((acc, order) => {
      const date = new Date(order.created_at)
      const month = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      acc[month] = (acc[month] || 0) + order.total_amount
      return acc
    }, {})

    const prompt = `En tant qu'expert en analyse de données e-commerce, analyse ces données de ventes mensuelles et prédis les ventes pour les 3 prochains mois. Données des ventes : ${JSON.stringify(salesData)}. 
    Fournis une réponse au format JSON avec : 
    {
      "predictions": [{"month": "string", "amount": number, "growth": number}],
      "insights": string,
      "recommendations": string[]
    }`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse de données e-commerce qui fournit des prédictions de ventes précises.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    const aiResponse = await response.json()
    const predictions = JSON.parse(aiResponse.choices[0].message.content)

    return new Response(JSON.stringify(predictions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in sales-predictions function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})