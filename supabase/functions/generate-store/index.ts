import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StoreRequest {
  niche: string;
  supplier: string;
  storeId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { niche, supplier, storeId } = await req.json() as StoreRequest;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use OpenAI to generate product ideas
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a dropshipping expert. Generate 30 winning product ideas for a ${niche} store using ${supplier} as the supplier. For each product, provide: name, description, and estimated price.`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await openAiResponse.json();
    const productIdeas = aiData.choices[0].message.content;

    // Parse the AI response and format products
    const products = productIdeas.split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((product: string) => {
        const [name, description, price] = product.split('|').map(s => s.trim());
        return {
          name,
          description,
          price: parseFloat(price.replace('$', '')),
          supplier,
          niche,
          image_url: null, // We'll generate images in a separate step
        };
      });

    // Get user_id from auth context
    const { data: { user } } = await supabase.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] || '');
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Insert products into the database
    const { data, error } = await supabase
      .from('ai_generated_products')
      .insert(
        products.map(product => ({
          ...product,
          user_id: user.id,
          store_id: storeId,
        }))
      );

    if (error) {
      throw error;
    }

    console.log('Successfully generated store products:', data);

    return new Response(
      JSON.stringify({ success: true, message: 'Store generated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating store:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});