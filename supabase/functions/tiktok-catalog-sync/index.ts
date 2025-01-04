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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { integration_id, product_ids } = await req.json()
    
    console.log('Starting catalog sync for integration:', integration_id, 'products:', product_ids)

    // Récupérer les informations d'intégration
    const { data: integration, error: integrationError } = await supabase
      .from('social_integrations')
      .select('*')
      .eq('id', integration_id)
      .single()

    if (integrationError) throw integrationError

    // Mettre à jour le statut de synchronisation
    const { error: updateError } = await supabase
      .from('social_catalog_items')
      .upsert(
        product_ids.map((productId: string) => ({
          integration_id,
          product_id: productId,
          user_id: integration.user_id,
          sync_status: 'pending',
          last_sync_at: new Date().toISOString()
        }))
      )

    if (updateError) throw updateError

    // Créer une entrée dans l'historique de synchronisation
    const { error: historyError } = await supabase
      .from('sync_history')
      .insert({
        user_id: integration.user_id,
        integration_id,
        sync_type: 'catalog',
        status: 'in_progress',
        items_processed: product_ids.length
      })

    if (historyError) throw historyError

    // Simuler l'envoi à l'API TikTok (à implémenter avec l'API réelle)
    for (const productId of product_ids) {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      console.log('Synchronizing product:', product)

      // Mise à jour du statut de synchronisation
      await supabase
        .from('social_catalog_items')
        .update({
          sync_status: 'completed',
          last_sync_at: new Date().toISOString(),
          platform_data: {
            tiktok_product_id: `tiktok_${productId}`, // Simulé
            sync_date: new Date().toISOString()
          }
        })
        .match({ integration_id, product_id: productId })
    }

    // Notification de succès
    await supabase
      .from('notifications')
      .insert({
        user_id: integration.user_id,
        title: 'Synchronisation TikTok Shop',
        content: `${product_ids.length} produits ont été synchronisés avec succès.`
      })

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `${product_ids.length} products synchronized successfully`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in catalog sync:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})