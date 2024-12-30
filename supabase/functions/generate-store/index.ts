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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request:', req);
    const { niche, supplier, storeId } = await req.json() as StoreRequest;
    console.log('Request data:', { niche, supplier, storeId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // Get OpenAI API key
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('Missing OpenAI API key');
    }

    // Use OpenAI to generate product ideas
    console.log('Calling OpenAI API...');
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a dropshipping expert. Generate 30 winning product ideas for a ${niche} store using ${supplier} as the supplier. For each product, provide the following format exactly: "Product Name | Description | Price". Price should be a number without currency symbol.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiData = await openAiResponse.json();
    console.log('OpenAI response received');

    // Parse the AI response and format products
    const productIdeas = aiData.choices[0].message.content.split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((product: string) => {
        const [name, description, price] = product.split('|').map(s => s.trim());
        return {
          name,
          description,
          price: parseFloat(price),
          supplier,
          niche,
          image_url: null,
        };
      });

    console.log('Parsed product ideas:', productIdeas);

    // Get user_id from auth context
    const { data: { user } } = await supabase.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] || '');
    
    if (!user) {
      throw new Error('Unauthorized - User not found');
    }

    console.log('User authenticated:', user.id);

    // Insert products into the database
    const { data, error } = await supabase
      .from('ai_generated_products')
      .insert(
        productIdeas.map(product => ({
          ...product,
          user_id: user.id,
          store_id: storeId,
        }))
      );

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Products inserted successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Store generated successfully',
        productsCount: productIdeas.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-store function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});