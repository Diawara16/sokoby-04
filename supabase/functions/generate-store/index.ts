import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ownerId = user.id;

    // --- Parse body ---
    const { store_name, niche } = await req.json();
    if (!store_name || !niche) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: store_name, niche' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[generate-store] Creating store for user:', ownerId, '| niche:', niche);

    // --- 1. Create store record ---
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({ owner_id: ownerId, store_name, niche })
      .select('id')
      .single();

    if (storeError || !store) {
      console.error('[generate-store] Store creation failed:', storeError);
      throw new Error('Failed to create store');
    }

    const storeId = store.id;
    console.log('[generate-store] Store created:', storeId);

    // --- 2. Fetch master products by niche ---
    const { data: masterProducts, error: mpError } = await supabase
      .from('master_products')
      .select('name, description, price, image, category, supplier')
      .ilike('niche', niche);

    if (mpError) {
      console.error('[generate-store] Error fetching master_products:', mpError);
      throw new Error('Failed to fetch master products');
    }

    if (!masterProducts || masterProducts.length === 0) {
      console.warn('[generate-store] No master products found for niche:', niche);
      return new Response(
        JSON.stringify({ success: true, storeId, productsCount: 0, message: 'Store created but no master products found for this niche' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- 3. Insert products into the products table ---
    const productsToInsert = masterProducts.map((mp) => ({
      name: mp.name,
      description: mp.description,
      price: mp.price,
      image: mp.image,
      category: mp.category,
      store_id: storeId,
      user_id: ownerId,
      stock: 100,
      status: 'active',
      is_visible: true,
      published: true,
    }));

    const { error: insertError } = await supabase
      .from('products')
      .insert(productsToInsert);

    if (insertError) {
      console.error('[generate-store] Products insert failed:', insertError);
      throw new Error('Failed to insert products');
    }

    console.log('[generate-store] Inserted', productsToInsert.length, 'products for store', storeId);

    return new Response(
      JSON.stringify({ success: true, storeId, productsCount: productsToInsert.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-store] Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
