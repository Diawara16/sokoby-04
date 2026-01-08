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
    // Extract and validate authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);
    const { niche, storeId } = await req.json() as Omit<StoreRequest, 'userId'>;
    const userId = user.id; // Use authenticated user ID only
    console.log('Request data:', { niche, storeId, userId });

    if (!niche || !storeId) {
      console.error('Missing required fields:', { niche, storeId });
      throw new Error('Missing required fields');
    }

    console.log('Supabase client initialized');

    // Check if brand settings already exist (including logo_url, colors, slogan)
    // This ensures all branding is preserved across stores
    // Order by created_at to get the most recent record
    const { data: existingBrand } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Only apply premium theme if no existing brand settings
    // If brand settings exist, ALL fields are preserved (logo_url, colors, slogan)
    if (!existingBrand) {
      const { error: themeError } = await supabase
        .from('brand_settings')
        .insert({
          user_id: userId,
          primary_color: '#8B5CF6',
          secondary_color: '#D6BCFA'
        })
        .select()
        .single();

      if (themeError) {
        console.error('Error applying premium theme:', themeError);
        throw new Error('Failed to apply premium theme');
      }
      console.log('Premium theme applied successfully (logo_url can be added later)');
    } else {
      // Explicitly verify logo_url is preserved across stores
      console.log('✓ Brand settings found - ALL fields preserved for new store:', {
        logo_url: existingBrand.logo_url || '(not set)',
        primary_color: existingBrand.primary_color,
        secondary_color: existingBrand.secondary_color,
        slogan: existingBrand.slogan || '(not set)'
      });
      
      if (!existingBrand.logo_url) {
        console.warn('⚠️ Brand settings exist but logo_url is not set. Upload a logo in Store Editor to persist it across all stores.');
      }
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

    // Parse the AI response and format products with placeholder images
    const productIdeas = aiData.choices[0].message.content.split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((product: string, index: number) => {
        const [name, description, price] = product.split('|').map(s => s.trim());
        // Generate deterministic placeholder image based on niche and index
        const nicheImages: Record<string, string> = {
          fashion: 'photo-1445205170230-053b83016050',
          electronics: 'photo-1518770660439-4636190af475',
          beauty: 'photo-1596462502278-27bfdc403348',
          home: 'photo-1556909114-f6e7ad7d3136',
          sports: 'photo-1461896836934- voices-of-liberty',
          general: 'photo-1472851294608-062f824d29cc',
        };
        const baseImage = nicheImages[niche.toLowerCase()] || nicheImages.general;
        const placeholderImage = `https://images.unsplash.com/${baseImage}?w=400&h=400&fit=crop&q=80&sig=${index}`;
        
        return {
          name,
          description,
          price: parseFloat(price),
          category: niche,
          stock: 100,
          status: 'active',
          is_visible: true,
          published: true, // LIVE: Always published
          image: placeholderImage, // LIVE: Never null
          user_id: userId,
          store_id: storeId,
        };
      });

    console.log('Parsed product ideas:', productIdeas);

    // Insert products into the products table (LIVE-ready)
    const { error: productsError } = await supabase
      .from('products')
      .insert(productIdeas);

    if (productsError) {
      console.error('Database error:', productsError);
      throw productsError;
    }

    console.log('Products inserted successfully into products table');

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