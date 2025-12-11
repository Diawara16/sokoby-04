import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo products data generator
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
  const startTime = Date.now();
  console.log('='.repeat(60));
  console.log('[GENERATE-AI-STORE] START at:', new Date().toISOString());
  console.log('[GENERATE-AI-STORE] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.text();
    console.log('[GENERATE-AI-STORE] Raw body:', body);
    
    let requestData;
    try {
      requestData = JSON.parse(body);
    } catch (e) {
      console.error('[GENERATE-AI-STORE] Failed to parse JSON body:', e.message);
      throw new Error('Invalid JSON body');
    }
    
    const { userId, storeName, plan, sessionId } = requestData;
    
    console.log('[GENERATE-AI-STORE] Request parameters:');
    console.log('  - userId:', userId);
    console.log('  - storeName:', storeName);
    console.log('  - plan:', plan);
    console.log('  - sessionId:', sessionId);

    if (!userId) {
      console.error('[GENERATE-AI-STORE] Missing userId');
      throw new Error('Missing required field: userId');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('[GENERATE-AI-STORE] ENV CHECK:');
    console.log('  - SUPABASE_URL:', supabaseUrl ? '✓ loaded' : '✗ MISSING');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ loaded' : '✗ MISSING');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    console.log('[GENERATE-AI-STORE] Finding store for user:', userId);

    // Find the store - try multiple approaches
    let store = null;
    
    // 1. Try by session ID first
    if (sessionId) {
      console.log('[GENERATE-AI-STORE] Searching by session ID:', sessionId);
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('stripe_checkout_session_id', sessionId)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[GENERATE-AI-STORE] ✓ Found store by session ID:', store.id);
      } else {
        console.log('[GENERATE-AI-STORE] Store not found by session ID:', error?.message);
      }
    }
    
    // 2. Fallback: find by user ID (most recent)
    if (!store) {
      console.log('[GENERATE-AI-STORE] Searching by user ID:', userId);
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[GENERATE-AI-STORE] ✓ Found store by user ID:', store.id);
      } else {
        console.log('[GENERATE-AI-STORE] Store not found by user ID:', error?.message);
      }
    }

    // 3. Create store if not found
    if (!store) {
      console.log('[GENERATE-AI-STORE] No store found - creating new store');
      const { data: newStore, error: createError } = await supabaseClient
        .from('store_settings')
        .insert({
          user_id: userId,
          store_name: storeName || 'Ma Boutique IA',
          store_type: 'ai',
          payment_status: 'completed',
          stripe_checkout_session_id: sessionId,
          initial_products_generated: false,
        })
        .select()
        .single();

      if (createError) {
        console.error('[GENERATE-AI-STORE] ✗ Failed to create store:', createError);
        throw new Error('Failed to create store: ' + createError.message);
      }
      
      store = newStore;
      console.log('[GENERATE-AI-STORE] ✓ Created new store:', store.id);
    }

    // Check idempotency - skip if already generated
    if (store.initial_products_generated) {
      console.log('[GENERATE-AI-STORE] ✓ Products already generated - returning early');
      return new Response(
        JSON.stringify({ 
          success: true, 
          storeId: store.id,
          message: 'Products already generated',
          alreadyGenerated: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Generate demo products based on plan
    const selectedPlan = plan || 'starter';
    const demoProducts = getDemoProducts(selectedPlan, 'general');
    console.log(`[GENERATE-AI-STORE] Generating ${demoProducts.length} products for plan: ${selectedPlan}`);

    // Insert products into the products table
    const productsToInsert = demoProducts.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      status: product.status,
      image: product.image,
      user_id: userId,
      created_at: new Date().toISOString(),
    }));

    console.log('[GENERATE-AI-STORE] Inserting products into products table...');
    const { data: insertedProducts, error: productsError } = await supabaseClient
      .from('products')
      .insert(productsToInsert)
      .select();

    if (productsError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error inserting to products table:', productsError.message);
      console.log('[GENERATE-AI-STORE] Trying ai_generated_products table as fallback...');
      
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
      
      const { data: aiProducts, error: aiProductsError } = await supabaseClient
        .from('ai_generated_products')
        .insert(aiProductsToInsert)
        .select();
      
      if (aiProductsError) {
        console.error('[GENERATE-AI-STORE] ⚠ Error inserting to ai_generated_products:', aiProductsError.message);
      } else {
        console.log('[GENERATE-AI-STORE] ✓ Inserted', aiProducts?.length || 0, 'products into ai_generated_products');
      }
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Inserted', insertedProducts?.length || 0, 'products into products table');
    }

    // Update store to mark products as generated
    console.log('[GENERATE-AI-STORE] Updating store to mark products as generated...');
    const { error: updateError } = await supabaseClient
      .from('store_settings')
      .update({
        initial_products_generated: true,
        store_type: 'ai',
        payment_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', store.id);

    if (updateError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error updating store:', updateError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Store marked as products generated');
    }

    // Ensure brand settings exist
    console.log('[GENERATE-AI-STORE] Checking brand settings...');
    const { data: brandSettings } = await supabaseClient
      .from('brand_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!brandSettings) {
      console.log('[GENERATE-AI-STORE] Creating brand settings...');
      const { error: brandError } = await supabaseClient
        .from('brand_settings')
        .insert({
          user_id: userId,
          primary_color: '#E53935',
          secondary_color: '#1976D2',
          slogan: `Bienvenue sur ${storeName || 'Ma Boutique'}`,
        });

      if (brandError) {
        console.error('[GENERATE-AI-STORE] ⚠ Error creating brand settings:', brandError.message);
      } else {
        console.log('[GENERATE-AI-STORE] ✓ Brand settings created');
      }
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Brand settings already exist');
    }

    // Create success notification
    console.log('[GENERATE-AI-STORE] Creating success notification...');
    const { error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Boutique IA créée avec succès!',
        content: `Votre boutique "${storeName || 'Ma Boutique'}" a été générée avec ${demoProducts.length} produits. Vous pouvez maintenant la personnaliser.`,
      });

    if (notifError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error creating notification:', notifError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Notification created');
    }

    const duration = Date.now() - startTime;
    console.log('[GENERATE-AI-STORE] ✓ COMPLETE - Generation took', duration, 'ms');
    console.log('='.repeat(60));

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: store.id,
        productsCount: demoProducts.length,
        plan: selectedPlan,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('[GENERATE-AI-STORE] ✗ FATAL ERROR:', error.message);
    console.error('[GENERATE-AI-STORE] Stack:', error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
