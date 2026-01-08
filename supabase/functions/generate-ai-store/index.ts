import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PRODUCTION products data generator - real, visible, purchasable products
const getProductionProducts = (plan: string, niche: string = 'general') => {
  const productCount = plan === 'pro' ? 50 : 10;
  const products = [];
  
  const niches: Record<string, any> = {
    fashion: {
      names: ['T-Shirt Premium', 'Jeans Slim Fit', 'Sneakers Classic', 'Veste en Cuir', 'Robe d\'Été', 'Pull Over Laine', 'Short Casual', 'Chemise Élégante', 'Manteau Hiver', 'Ceinture Cuir'],
      descriptions: [
        'T-shirt 100% coton biologique, coupe moderne et confortable. Lavable en machine.',
        'Jean slim fit stretch, coupe ajustée. Disponible en plusieurs tailles.',
        'Sneakers classiques avec semelle en caoutchouc antidérapante.',
        'Veste en cuir véritable, doublure satin. Style intemporel.',
        'Robe légère parfaite pour l\'été. Tissu respirant.',
        'Pull en laine mérinos extra-doux, coupe classique.',
        'Short décontracté avec poches, parfait pour le quotidien.',
        'Chemise en coton égyptien, coupe ajustée.',
        'Manteau chaud avec isolation thermique avancée.',
        'Ceinture en cuir véritable avec boucle métal.',
      ],
      prices: [29.99, 79.99, 89.99, 199.99, 59.99, 69.99, 34.99, 54.99, 149.99, 39.99],
    },
    electronics: {
      names: ['Écouteurs Sans Fil Pro', 'Chargeur Rapide 65W', 'Coque Protection Premium', 'Câble USB-C 2m', 'Support Téléphone Ajustable', 'Power Bank 20000mAh', 'Adaptateur Multi-Port', 'Webcam HD 1080p', 'Clavier Bluetooth', 'Souris Sans Fil Ergonomique'],
      descriptions: [
        'Écouteurs Bluetooth 5.3 avec réduction de bruit active. Autonomie 30h.',
        'Chargeur rapide compatible USB-C et Lightning. Technologie GaN.',
        'Coque antichoc avec coins renforcés. Compatible charge sans fil.',
        'Câble USB-C tressé renforcé, transfert rapide 100W.',
        'Support ajustable 360° avec fixation solide.',
        'Batterie externe charge rapide PD. 2 ports USB.',
        'Hub 7-en-1: HDMI, USB-A, USB-C, SD, microSD.',
        'Webcam Full HD avec microphone intégré et correction lumière.',
        'Clavier compact Bluetooth multi-appareils.',
        'Souris ergonomique silencieuse avec capteur optique 4000 DPI.',
      ],
      prices: [79.99, 34.99, 24.99, 14.99, 19.99, 49.99, 39.99, 59.99, 44.99, 34.99],
    },
    beauty: {
      names: ['Sérum Visage Anti-Âge', 'Crème Hydratante Jour', 'Masque Purifiant Argile', 'Huile Essentielle Bio', 'Gommage Visage Doux', 'Lotion Tonique', 'Baume Lèvres Intense', 'Soin Nuit Régénérant', 'Protection Solaire SPF50', 'Eau Florale Rose'],
      descriptions: [
        'Sérum concentré à l\'acide hyaluronique et vitamine C. Résultats visibles en 14 jours.',
        'Crème hydratante légère, pénètre rapidement. Pour tous types de peau.',
        'Masque à l\'argile verte, nettoie les pores en profondeur.',
        'Huile essentielle 100% pure et naturelle, certifiée bio.',
        'Gommage aux grains fins naturels, exfoliation douce.',
        'Lotion tonifiante sans alcool, resserre les pores.',
        'Baume nourrissant longue durée aux huiles naturelles.',
        'Soin nuit intensif à la vitamine E et collagène.',
        'Écran solaire haute protection, texture invisible.',
        'Eau florale pure de rose de Damas, apaisante.',
      ],
      prices: [44.99, 29.99, 19.99, 24.99, 16.99, 22.99, 12.99, 54.99, 26.99, 18.99],
    },
    general: {
      names: ['Produit Premium', 'Article Best-Seller', 'Édition Exclusive', 'Pack Découverte', 'Nouveauté Tendance', 'Classique Revisité', 'Série Limitée', 'Collection Pro', 'Essentiel Quotidien', 'Choix Expert'],
      descriptions: [
        'Produit de qualité supérieure, sélectionné par nos experts.',
        'Notre produit le plus vendu, satisfaction garantie.',
        'Édition exclusive disponible en quantité limitée.',
        'Pack découverte parfait pour essayer nos produits.',
        'Dernière innovation de notre gamme.',
        'Un classique revisité avec des matériaux premium.',
        'Série limitée, design exclusif.',
        'Pour les professionnels exigeants.',
        'Indispensable au quotidien.',
        'Recommandé par nos experts.',
      ],
      prices: [39.99, 29.99, 99.99, 59.99, 44.99, 34.99, 79.99, 69.99, 24.99, 54.99],
    },
  };

  const selectedNiche = niches[niche] || niches.general;
  
  for (let i = 0; i < productCount; i++) {
    const idx = i % selectedNiche.names.length;
    const version = Math.floor(i / selectedNiche.names.length);
    products.push({
      name: version > 0 ? `${selectedNiche.names[idx]} V${version + 1}` : selectedNiche.names[idx],
      description: selectedNiche.descriptions[idx],
      price: selectedNiche.prices[idx] + (version * 5),
      category: niche,
      stock: Math.floor(Math.random() * 100) + 20,
      status: 'active', // PRODUCTION: All products are active
      is_visible: true, // PRODUCTION: All products are visible
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
    
    const { userId, storeName, plan, sessionId, storeId, isProduction } = requestData;
    
    console.log('[GENERATE-AI-STORE] Request parameters:');
    console.log('  - userId:', userId);
    console.log('  - storeName:', storeName);
    console.log('  - plan:', plan);
    console.log('  - sessionId:', sessionId);
    console.log('  - storeId:', storeId);
    console.log('  - isProduction:', isProduction);

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
    
    // 1. Try by store ID first (if provided)
    if (storeId) {
      console.log('[GENERATE-AI-STORE] Searching by store ID:', storeId);
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('id', storeId)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[GENERATE-AI-STORE] ✓ Found store by ID:', store.id);
      } else {
        console.log('[GENERATE-AI-STORE] Store not found by ID:', error?.message);
      }
    }
    
    // 2. Try by session ID
    if (!store && sessionId) {
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
    
    // 3. Fallback: find by user ID (most recent)
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

    // 4. Create store if not found
    if (!store) {
      console.log('[GENERATE-AI-STORE] No store found - creating new PRODUCTION store');
      const { data: newStore, error: createError } = await supabaseClient
        .from('store_settings')
        .insert({
          user_id: userId,
          store_name: storeName || 'Ma Boutique IA',
          store_type: 'ai',
          payment_status: 'completed',
          store_status: 'processing',
          is_production: false, // Will be set to true after products generated
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

    // Check idempotency - skip if already fully generated and production
    if (store.initial_products_generated && store.is_production) {
      console.log('[GENERATE-AI-STORE] ✓ Store is already PRODUCTION - returning early');
      return new Response(
        JSON.stringify({ 
          success: true, 
          storeId: store.id,
          message: 'Store already in production',
          alreadyGenerated: true,
          isProduction: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Generate PRODUCTION products based on plan
    const selectedPlan = plan || 'starter';
    const productionProducts = getProductionProducts(selectedPlan, 'general');
    console.log(`[GENERATE-AI-STORE] Generating ${productionProducts.length} PRODUCTION products for plan: ${selectedPlan}`);

    // Insert products into the products table - ACTIVE and VISIBLE
    const productsToInsert = productionProducts.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      status: 'active', // PRODUCTION: Active status
      is_visible: true, // PRODUCTION: Visible to customers
      image: product.image,
      user_id: userId,
      created_at: new Date().toISOString(),
    }));

    console.log('[GENERATE-AI-STORE] Inserting PRODUCTION products into products table...');
    const { data: insertedProducts, error: productsError } = await supabaseClient
      .from('products')
      .insert(productsToInsert)
      .select();

    if (productsError) {
      console.error('[GENERATE-AI-STORE] ✗ Error inserting to products table:', productsError.message);
      throw new Error('Failed to insert products: ' + productsError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Inserted', insertedProducts?.length || 0, 'PRODUCTION products into products table');
    }

    // Update store to mark as PRODUCTION ACTIVE
    console.log('[GENERATE-AI-STORE] Updating store to PRODUCTION ACTIVE...');
    const { error: updateError } = await supabaseClient
      .from('store_settings')
      .update({
        initial_products_generated: true,
        store_type: 'ai',
        payment_status: 'completed',
        store_status: 'active', // PRODUCTION: Active status
        is_production: true, // PRODUCTION: Mark as live
        production_activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', store.id);

    if (updateError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error updating store:', updateError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Store marked as PRODUCTION ACTIVE');
    }

    // Also update any existing products for this user to be active (convert demo to production)
    console.log('[GENERATE-AI-STORE] Converting any existing demo products to ACTIVE...');
    const { error: updateProductsError } = await supabaseClient
      .from('products')
      .update({
        status: 'active',
        is_visible: true,
      })
      .eq('user_id', userId);

    if (updateProductsError) {
      console.log('[GENERATE-AI-STORE] ⚠ Could not update existing products:', updateProductsError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ All user products marked as ACTIVE');
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
        title: '🚀 Boutique LIVE - Prête pour les ventes!',
        content: `Votre boutique de production "${storeName || 'Ma Boutique'}" est maintenant en ligne avec ${productionProducts.length} produits actifs. Commencez à vendre dès maintenant!`,
      });

    if (notifError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error creating notification:', notifError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Notification created');
    }

    const duration = Date.now() - startTime;
    console.log('[GENERATE-AI-STORE] ✓ PRODUCTION COMPLETE - Generation took', duration, 'ms');
    console.log('='.repeat(60));

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: store.id,
        productsCount: productionProducts.length,
        plan: selectedPlan,
        isProduction: true,
        storeStatus: 'active',
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