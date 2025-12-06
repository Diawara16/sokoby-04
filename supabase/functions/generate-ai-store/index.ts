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
      console.log('Store not found, trying to find by user_id only');
      // Fallback: try to find store by user_id only
      const { data: fallbackStore, error: fallbackError } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (fallbackError || !fallbackStore) {
        throw new Error('Store not found');
      }
    }

    const storeData = store || {};
    
    // Generate demo products based on plan
    const demoProducts = getDemoProducts(plan, 'general');
    console.log(`Generating ${demoProducts.length} products for plan: ${plan}`);

    // Insert products into the products table
    const productsToInsert = demoProducts.map(product => ({
      ...product,
      user_id: userId,
      created_at: new Date().toISOString(),
    }));

    const { error: productsError } = await supabaseClient
      .from('products')
      .insert(productsToInsert);

    if (productsError) {
      console.error('Error inserting products:', productsError);
      // Try ai_generated_products table as fallback
      const storeId = store?.id || storeData.id;
      const { error: aiProductsError } = await supabaseClient
        .from('ai_generated_products')
        .insert(demoProducts.map(p => ({ 
          ...p, 
          store_id: storeId,
          user_id: userId,
          niche: 'general',
          supplier: 'AI Generated',
        })));
      
      if (aiProductsError) {
        console.error('Error inserting to ai_generated_products:', aiProductsError);
        // Don't throw, continue with store creation
      } else {
        console.log('Products inserted into ai_generated_products table');
      }
    } else {
      console.log('Products inserted into products table');
    }

    // Update store to mark products as generated
    const storeId = store?.id || storeData.id;
    if (storeId) {
      const { error: updateError } = await supabaseClient
        .from('store_settings')
        .update({
          initial_products_generated: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', storeId);

      if (updateError) {
        console.error('Error updating store:', updateError);
      }
    }

    // Get or create brand settings
    const { data: brandSettings } = await supabaseClient
      .from('brand_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!brandSettings) {
      const { error: brandError } = await supabaseClient
        .from('brand_settings')
        .insert({
          user_id: userId,
          primary_color: '#E53935',
          secondary_color: '#1976D2',
          slogan: `Bienvenue sur ${storeName}`,
        });

      if (brandError) {
        console.error('Error creating brand settings:', brandError);
      }
    }

    // Create store pages
    const pages = [
      { type: 'about', title: 'À propos', content: `Bienvenue sur ${storeName}. Nous sommes passionnés par la qualité et le service client.` },
      { type: 'contact', title: 'Contact', content: 'Contactez-nous pour toute question.' },
      { type: 'policy', title: 'Politique de confidentialité', content: 'Votre vie privée est importante pour nous.' },
      { type: 'terms', title: 'Conditions générales', content: 'Conditions générales de vente.' },
    ];

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

    console.log('AI store generated successfully:', storeId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: storeId,
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
