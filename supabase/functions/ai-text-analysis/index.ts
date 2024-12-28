import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    // Simuler une analyse de sentiment basique
    const words = text.toLowerCase().split(' ');
    const positiveWords = ['bon', 'super', 'excellent', 'génial', 'heureux', 'content'];
    const negativeWords = ['mauvais', 'terrible', 'nul', 'triste', 'déçu'];
    
    let score = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });

    const sentiment = score > 0 ? 'positif' : score < 0 ? 'négatif' : 'neutre';

    return new Response(
      JSON.stringify({
        sentiment,
        score,
        confidence: Math.abs(score) / words.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});