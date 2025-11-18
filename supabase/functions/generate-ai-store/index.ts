import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo products data
const getDemoProducts = (plan: string, niche: string = 'general') => {
  const productCount = plan === 'starter' ? 10 : 50;
  const products = [];
  
  const niches: Record<string, any> = {
    fashion: {
      names: ['T-Shirt Premium', 'Jeans Slim', 'Sneakers Classic', 'Veste en Cuir', 'Robe d\'Été'],
      descriptions: ['Haute qualité', 'Coupe moderne', 'Confort optimal', 'Style intemporel', 'Design élégant'],
      prices: [29.99, 79.99, 89.99, 199.99, 59.99],
    },
    electronics: {
      names: ['Écouteurs Sans Fil', 'Chargeur Rapide', 'Coque Protection', 'Câble USB-C', 'Support Téléphone'],
      descriptions: ['Son HD', 'Charge ultra-rapide', 'Protection maximale', 'Compatible tous appareils', 'Rotation 360°'],
      prices: [49.99, 24.99, 14.99, 9.99, 19.99],
    },
    beauty: {
      names: ['Sérum Visage', 'Crème Hydratante', 'Masque Purifiant', 'Huile Essentielle', 'Gommage Doux'],
      descriptions: ['Anti-âge', 'Peau éclatante', 'Nettoie en profondeur', '100% naturel', 'Exfoliation douce'],
      prices: [34.99, 29.99, 19.99, 24.99, 16.99],
    },
    general: {
      names: ['Produit Premium', 'Article Populaire', 'Best-Seller', 'Édition Limitée', 'Pack Découverte'],
      descriptions: ['Qualité supérieure', 'Très apprécié', 'Le plus vendu', 'Collection exclusive', 'Essayez nos produits'],
      prices: [39.99, 29.99, 49.99, 99.99, 59.99],
    },
  };

  const selectedNiche = niches[niche] || niches.general;
  
  for (let i = 0; i < productCount; i++) {
    const idx = i % selectedNiche.names.length;
    products.push({
      name: `${selectedNiche.names[idx]} ${Math.floor(i / selectedNiche.names.length) > 0 ? `V${Math.floor(i / selectedNiche.names.length) + 1}` : ''}`.trim(),
      description: `${selectedNiche.descriptions[idx]}. Produit de haute qualité avec garantie satisfait ou remboursé.`,
      price: selectedNiche.prices[idx],
      category: niche,
      stock_quantity: Math.floor(Math.random() * 100) + 20,
      sku: `SKU-${Date.now()}-${i}`,
      is_active: true,
    });
  }
  
  return products;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, storeName, plan, sessionId } = await req.json();

    if (!userId || !storeName || !plan) {
      throw new Error('Missing required fields');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('Generating AI store for user:', userId, 'plan:', plan);

    // Get store record
    const { data: store, error: storeError } = await supabaseClient
      .from('store_settings')
      .select('*')
      .eq('user_id', userId)
      .eq('stripe_checkout_session_id', sessionId)
      .single();

    if (storeError || !store) {
      throw new Error('Store not found');
    }

    // Generate demo products
    const demoProducts = getDemoProducts(plan, 'general');
    
    const productsToInsert = demoProducts.map(product => ({
      ...product,
      user_id: userId,
      store_id: store.id,
      created_at: new Date().toISOString(),
    }));

    // Insert products
    const { error: productsError } = await supabaseClient
      .from('ai_generated_products')
      .insert(productsToInsert);

    if (productsError) {
      console.error('Error inserting products:', productsError);
      throw productsError;
    }

    // Update store to mark products as generated
    const { error: updateError } = await supabaseClient
      .from('store_settings')
      .update({
        initial_products_generated: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', store.id);

    if (updateError) {
      console.error('Error updating store:', updateError);
      throw updateError;
    }

    // Get or create brand settings
    const { data: brandSettings } = await supabaseClient
      .from('brand_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!brandSettings) {
      // Create default brand settings
      const { error: brandError } = await supabaseClient
        .from('brand_settings')
        .insert({
          user_id: userId,
          primary_color: '#E53935',
          secondary_color: '#1976D2',
        });

      if (brandError) {
        console.error('Error creating brand settings:', brandError);
      }
    }

    // Create success notification
    const { error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Boutique IA créée',
        content: `Votre boutique "${storeName}" a été générée avec succès avec ${demoProducts.length} produits !`,
      });

    if (notifError) {
      console.error('Error creating notification:', notifError);
    }

    console.log('AI store generated successfully:', store.id);

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
    console.error('Error generating AI store:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
