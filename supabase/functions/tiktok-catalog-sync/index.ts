import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { integration_id, product_ids } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    console.log('Début de la synchronisation du catalogue pour l\'intégration:', integration_id)
    console.log('Produits à synchroniser:', product_ids)

    // Créer les entrées de synchronisation pour chaque produit
    const { data: catalogItems, error: syncError } = await supabase
      .from('social_catalog_items')
      .upsert(
        product_ids.map((productId: string) => ({
          integration_id,
          product_id: productId,
          sync_status: 'pending',
          last_sync_at: new Date().toISOString()
        }))
      )
      .select()

    if (syncError) throw syncError

    console.log('Éléments du catalogue créés:', catalogItems)

    return new Response(
      JSON.stringify({ success: true, data: catalogItems }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Erreur de synchronisation:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})