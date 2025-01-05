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

    const { platform, userId } = await req.json()
    
    console.log(`Initialisation de l'intégration Instagram Shop pour l'utilisateur ${userId}`)

    // Vérifier si l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié')
    }

    // Créer ou mettre à jour l'intégration
    const { data: integration, error: integrationError } = await supabase
      .from('social_integrations')
      .upsert({
        user_id: userId,
        platform: 'instagram',
        status: 'pending',
        settings: {
          setup_step: 'initial',
          business_account_required: true
        },
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (integrationError) throw integrationError

    console.log(`Intégration Instagram Shop créée/mise à jour:`, integration)

    return new Response(
      JSON.stringify({ success: true, data: integration }),
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