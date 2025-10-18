import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StoreRequest {
  niche: string;
  storeId: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request:', req);
    const { niche, storeId, userId } = await req.json() as StoreRequest;
    console.log('Request data:', { niche, storeId, userId });

    if (!niche || !storeId || !userId) {
      console.error('Missing required fields:', { niche, storeId, userId });
      throw new Error('Missing required fields');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // Check if brand settings already exist
    const { data: existingBrand } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Only apply premium theme if no existing brand settings (preserve logo, colors, slogan)
    if (!existingBrand) {
      const { error: themeError } = await supabase
        .from('brand_settings')
        .insert({
          user_id: userId,
          primary_color: '#8B5CF6',
          secondary_color: '#D6BCFA'
        });

      if (themeError) {
        console.error('Error applying premium theme:', themeError);
        throw themeError;
      }
      console.log('Premium theme applied successfully');
    } else {
      console.log('Brand settings already exist, preserving them');
    }

    // Get Lovable AI API key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('Missing Lovable API key');
      throw new Error('Missing Lovable API key');
    }

    // Use Lovable AI (Gemini 2.5 Flash) to generate product ideas
    console.log('Calling Lovable AI API...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a dropshipping expert. Generate 30 winning product ideas for a ${niche} store. For each product, provide the following format exactly: "Product Name | Description | Price". Price should be a number without currency symbol (in euros).`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error('Lovable AI API error:', errorData);
      throw new Error(`Lovable AI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiData = await aiResponse.json();
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
          niche,
          image_url: null,
          user_id: userId,
          store_id: storeId,
          supplier: 'AI Generated'
        };
      });

    console.log('Parsed product ideas:', productIdeas);

    // Insert products into the database
    const { error: productsError } = await supabase
      .from('ai_generated_products')
      .insert(productIdeas);

    if (productsError) {
      console.error('Database error:', productsError);
      throw productsError;
    }

    console.log('Products inserted successfully');

    // Créer une notification pour informer l'utilisateur
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Boutique créée avec succès',
        content: `Votre boutique ${niche} a été créée avec ${productIdeas.length} produits et le thème premium a été appliqué.`,
        read: false
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Store generated successfully',
        productsCount: productIdeas.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
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