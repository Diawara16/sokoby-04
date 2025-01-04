import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const body = await req.json()
    const { integration_id, product_id, platform_data } = body

    // Mettre à jour le statut de synchronisation du produit
    const { error: updateError } = await supabase
      .from('social_catalog_items')
      .update({
        sync_status: 'completed',
        platform_data: platform_data,
        last_sync_at: new Date().toISOString()
      })
      .match({ integration_id, product_id })

    if (updateError) throw updateError

    // Créer une notification pour informer l'utilisateur
    const { data: catalogItem } = await supabase
      .from('social_catalog_items')
      .select('user_id')
      .match({ integration_id, product_id })
      .single()

    if (catalogItem) {
      await supabase
        .from('notifications')
        .insert({
          user_id: catalogItem.user_id,
          title: 'Produit synchronisé',
          content: 'Un produit a été synchronisé avec succès sur la plateforme sociale.'
        })
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})