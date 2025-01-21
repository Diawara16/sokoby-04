import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer les domaines à vérifier
    const { data: domains, error: fetchError } = await supabaseClient
      .from('dns_monitoring')
      .select('*')
      .eq('status', 'pending')

    if (fetchError) {
      throw fetchError
    }

    console.log(`Vérification de ${domains?.length ?? 0} domaines`)

    for (const domain of domains ?? []) {
      console.log(`Vérification du domaine: ${domain.domain_name}`)
      
      try {
        // Vérifier l'enregistrement A
        const response = await fetch(`https://dns.google/resolve?name=${domain.domain_name}&type=A`)
        const data = await response.json()
        
        const hasCorrectARecord = data.Answer?.some(
          (record: any) => record.type === 1 && record.data === '76.76.21.21'
        )

        const issues = []
        if (!hasCorrectARecord) {
          issues.push('Enregistrement A incorrect ou manquant')
        }

        // Mettre à jour le statut dans la base de données
        const { error: updateError } = await supabaseClient
          .from('dns_monitoring')
          .update({
            status: issues.length === 0 ? 'ok' : 'error',
            dns_records: data,
            issues,
            last_check_time: new Date().toISOString()
          })
          .eq('id', domain.id)

        if (updateError) {
          console.error(`Erreur lors de la mise à jour du domaine ${domain.domain_name}:`, updateError)
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification du domaine ${domain.domain_name}:`, error)
        
        // Mettre à jour le statut en cas d'erreur
        await supabaseClient
          .from('dns_monitoring')
          .update({
            status: 'error',
            issues: ['Erreur lors de la vérification DNS'],
            last_check_time: new Date().toISOString()
          })
          .eq('id', domain.id)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Vérification DNS terminée' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})