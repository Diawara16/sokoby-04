import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Fonction DNS check démarrée')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Vérifier que les variables d'environnement sont définies
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement manquantes')
    }

    console.log('Création du client Supabase')
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Récupérer les domaines à vérifier
    console.log('Récupération des domaines en attente')
    const { data: domains, error: fetchError } = await supabaseClient
      .from('dns_monitoring')
      .select('*')
      .eq('status', 'pending')

    if (fetchError) {
      console.error('Erreur lors de la récupération des domaines:', fetchError)
      throw fetchError
    }

    console.log(`Vérification de ${domains?.length ?? 0} domaines`)

    const results = []
    for (const domain of domains ?? []) {
      console.log(`Vérification du domaine: ${domain.domain_name}`)
      
      try {
        // Vérifier l'enregistrement A
        const dnsResponse = await fetch(
          `https://dns.google/resolve?name=${domain.domain_name}&type=A`,
          { headers: { Accept: 'application/json' } }
        )
        
        if (!dnsResponse.ok) {
          throw new Error(`Erreur DNS API: ${dnsResponse.status}`)
        }

        const data = await dnsResponse.json()
        console.log('Réponse DNS:', data)
        
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
          throw updateError
        }

        results.push({
          domain: domain.domain_name,
          status: issues.length === 0 ? 'ok' : 'error',
          issues
        })
      } catch (error) {
        console.error(`Erreur lors de la vérification du domaine ${domain.domain_name}:`, error)
        
        // Mettre à jour le statut en cas d'erreur
        await supabaseClient
          .from('dns_monitoring')
          .update({
            status: 'error',
            issues: [`Erreur lors de la vérification DNS: ${error.message}`],
            last_check_time: new Date().toISOString()
          })
          .eq('id', domain.id)

        results.push({
          domain: domain.domain_name,
          status: 'error',
          error: error.message
        })
      }
    }

    console.log('Vérification DNS terminée')
    return new Response(
      JSON.stringify({ 
        message: 'Vérification DNS terminée',
        results 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Erreur globale:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})