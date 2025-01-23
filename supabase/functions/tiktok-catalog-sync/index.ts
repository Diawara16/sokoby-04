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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { integration_id, product_ids } = await req.json()
    
    console.log('Starting catalog sync for:', { integration_id, product_ids })

    // Mettre à jour le statut de synchronisation pour chaque produit
    for (const productId of product_ids) {
      const { error: updateError } = await supabase
        .from('social_catalog_items')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          integration_id,
          product_id: productId,
          sync_status: 'pending',
          last_sync_at: new Date().toISOString()
        })

      if (updateError) {
        console.error('Error updating catalog item:', updateError)
        throw updateError
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
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