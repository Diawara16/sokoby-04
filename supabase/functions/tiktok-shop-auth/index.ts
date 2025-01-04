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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié')
    }

    console.log('Initialisation de l\'intégration TikTok Shop pour l\'utilisateur:', user.id)

    // Créer ou mettre à jour l'intégration
    const { data: integration, error: integrationError } = await supabase
      .from('social_integrations')
      .upsert({
        user_id: user.id,
        platform: 'tiktok',
        status: 'pending',
        settings: {
          shop_region: 'FR',
          integration_type: 'shop'
        },
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (integrationError) throw integrationError

    console.log('Intégration TikTok créée/mise à jour:', integration)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: integration,
        authUrl: `https://auth.tiktok-shops.com/oauth/authorize?app_key=${Deno.env.get('TIKTOK_APP_KEY')}&state=${user.id}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Erreur:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})