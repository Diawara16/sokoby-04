import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo products data
const getDemoProducts = (plan: string, niche: string = 'general') => {
  const productCount = plan === 'pro' ? 50 : 10;
  const products = [];
  
  const niches: Record<string, any> = {
    fashion: {
      names: ['T-Shirt Premium', 'Jeans Slim', 'Sneakers Classic', 'Veste en Cuir', 'Robe d\'Été', 'Pull Over', 'Short Casual', 'Chemise Élégante', 'Manteau Hiver', 'Accessoire Mode'],
      descriptions: ['Haute qualité', 'Coupe moderne', 'Confort optimal', 'Style intemporel', 'Design élégant', 'Doux et chaud', 'Léger et confortable', 'Coupe ajustée', 'Protection hivernale', 'Touche finale parfaite'],
      prices: [29.99, 79.99, 89.99, 199.99, 59.99, 49.99, 34.99, 54.99, 149.99, 24.99],
    },
    electronics: {
      names: ['Écouteurs Sans Fil', 'Chargeur Rapide', 'Coque Protection', 'Câble USB-C', 'Support Téléphone', 'Power Bank', 'Adaptateur Multi-Port', 'Webcam HD', 'Clavier Bluetooth', 'Souris Sans Fil'],
      descriptions: ['Son HD', 'Charge ultra-rapide', 'Protection maximale', 'Compatible tous appareils', 'Rotation 360°', 'Grande capacité', 'Connectivité universelle', 'Qualité streaming', 'Frappe silencieuse', 'Précision optimale'],
      prices: [49.99, 24.99, 14.99, 9.99, 19.99, 39.99, 29.99, 59.99, 44.99, 34.99],
    },
    beauty: {
      names: ['Sérum Visage', 'Crème Hydratante', 'Masque Purifiant', 'Huile Essentielle', 'Gommage Doux', 'Lotion Tonique', 'Baume Lèvres', 'Soin Nuit', 'Protection Solaire', 'Eau Florale'],
      descriptions: ['Anti-âge', 'Peau éclatante', 'Nettoie en profondeur', '100% naturel', 'Exfoliation douce', 'Pores resserrés', 'Hydratation intense', 'Régénération cellulaire', 'SPF 50+', 'Fraîcheur naturelle'],
      prices: [34.99, 29.99, 19.99, 24.99, 16.99, 22.99, 12.99, 44.99, 26.99, 18.99],
    },
    general: {
      names: ['Produit Premium', 'Article Populaire', 'Best-Seller', 'Édition Limitée', 'Pack Découverte', 'Nouveauté', 'Classique Revisité', 'Série Spéciale', 'Collection Pro', 'Essentiel Quotidien'],
      descriptions: ['Qualité supérieure', 'Très apprécié', 'Le plus vendu', 'Collection exclusive', 'Essayez nos produits', 'Dernière innovation', 'Un classique amélioré', 'Série exclusive', 'Pour professionnels', 'Indispensable'],
      prices: [39.99, 29.99, 49.99, 99.99, 59.99, 44.99, 34.99, 79.99, 69.99, 24.99],
    },
  };

  const selectedNiche = niches[niche] || niches.general;
  
  for (let i = 0; i < productCount; i++) {
    const idx = i % selectedNiche.names.length;
    const version = Math.floor(i / selectedNiche.names.length);
    products.push({
      name: version > 0 ? `${selectedNiche.names[idx]} V${version + 1}` : selectedNiche.names[idx],
      description: `${selectedNiche.descriptions[idx]}. Produit de haute qualité avec garantie satisfait ou remboursé.`,
      price: selectedNiche.prices[idx] + (version * 5),
      category: niche,
      stock: Math.floor(Math.random() * 100) + 20,
      status: 'active',
      image: `https://images.unsplash.com/photo-${1560472355 + i}?w=400&h=400&fit=crop`,
    });
  }
  
  return products;
};

serve(async (req) => {
  console.log('[GENERATE-AI-STORE] Function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, storeName, plan, sessionId } = await req.json();
    
    console.log('[GENERATE-AI-STORE] Request data:', { userId, storeName, plan, sessionId });

    if (!userId || !storeName || !plan) {
      console.error('[GENERATE-AI-STORE] Missing required fields');
      throw new Error('Missing required fields: userId, storeName, plan');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('[GENERATE-AI-STORE] Generating AI store for user:', userId, 'plan:', plan);

    // Find the store
    let store;
    
    if (sessionId) {
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('stripe_checkout_session_id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[GENERATE-AI-STORE] Found store by session ID:', store.id);
      }
    }
    
    if (!store) {
      // Fallback: find the most recent store for this user
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) {
        console.error('[GENERATE-AI-STORE] Store not found:', error);
        throw new Error('Store not found for user');
      }
      store = data;
      console.log('[GENERATE-AI-STORE] Found store by user ID:', store.id);
    }

    // Check if products are already generated
    if (store.initial_products_generated) {
      console.log('[GENERATE-AI-STORE] Products already generated for store:', store.id);
      return new Response(
        JSON.stringify({ 
          success: true, 
          storeId: store.id,
          message: 'Products already generated',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate demo products based on plan
    const demoProducts = getDemoProducts(plan, 'general');
    console.log(`[GENERATE-AI-STORE] Generating ${demoProducts.length} products for plan: ${plan}`);

    // Insert products into the products table
    const productsToInsert = demoProducts.map(product => ({
      ...product,
      user_id: userId,
      created_at: new Date().toISOString(),
    }));

    const { data: insertedProducts, error: productsError } = await supabaseClient
      .from('products')
      .insert(productsToInsert)
      .select();

    if (productsError) {
      console.error('[GENERATE-AI-STORE] Error inserting to products table:', productsError);
      
      // Try ai_generated_products table as fallback
      const aiProductsToInsert = demoProducts.map(p => ({ 
        name: p.name,
        description: p.description,
        price: p.price,
        image_url: p.image,
        store_id: store.id,
        user_id: userId,
        niche: 'general',
        supplier: 'AI Generated',
        status: 'active',
      }));
      
      const { error: aiProductsError } = await supabaseClient
        .from('ai_generated_products')
        .insert(aiProductsToInsert);
      
      if (aiProductsError) {
        console.error('[GENERATE-AI-STORE] Error inserting to ai_generated_products:', aiProductsError);
      } else {
        console.log('[GENERATE-AI-STORE] Products inserted into ai_generated_products table');
      }
    } else {
      console.log('[GENERATE-AI-STORE] Inserted', insertedProducts?.length || 0, 'products into products table');
    }

    // Update store to mark products as generated
    const { error: updateError } = await supabaseClient
      .from('store_settings')
      .update({
        initial_products_generated: true,
        store_type: 'ai',
        updated_at: new Date().toISOString(),
      })
      .eq('id', store.id);

    if (updateError) {
      console.error('[GENERATE-AI-STORE] Error updating store:', updateError);
    } else {
      console.log('[GENERATE-AI-STORE] Store marked as products generated');
    }

    // Ensure brand settings exist
    const { data: brandSettings } = await supabaseClient
      .from('brand_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!brandSettings) {
      console.log('[GENERATE-AI-STORE] Creating brand settings');
      const { error: brandError } = await supabaseClient
        .from('brand_settings')
        .insert({
          user_id: userId,
          primary_color: '#E53935',
          secondary_color: '#1976D2',
          slogan: `Bienvenue sur ${storeName}`,
        });

      if (brandError) {
        console.error('[GENERATE-AI-STORE] Error creating brand settings:', brandError);
      }
    }

    // Create success notification
    const { error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Boutique IA créée avec succès!',
        content: `Votre boutique "${storeName}" a été générée avec ${demoProducts.length} produits. Vous pouvez maintenant la personnaliser.`,
      });

    if (notifError) {
      console.error('[GENERATE-AI-STORE] Error creating notification:', notifError);
    }

    console.log('[GENERATE-AI-STORE] AI store generated successfully:', store.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: store.id,
        productsCount: demoProducts.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[GENERATE-AI-STORE] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
