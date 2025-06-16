
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MigrationRequest {
  shopify_store_url: string
  shopify_access_token?: string
  contact_email: string
  contact_phone?: string
  store_size: 'small' | 'medium' | 'large'
  migration_type: {
    products: boolean
    customers: boolean
    orders: boolean
  }
  notes?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      throw new Error('Non autorisé')
    }

    if (req.method === 'POST') {
      const migrationData: MigrationRequest = await req.json()
      
      console.log('Nouvelle demande de migration:', migrationData)

      // Créer la demande de migration
      const { data: migrationRequest, error: requestError } = await supabase
        .from('migration_requests')
        .insert({
          user_id: user.id,
          source_platform: 'shopify',
          shopify_store_url: migrationData.shopify_store_url,
          shopify_access_token: migrationData.shopify_access_token,
          contact_email: migrationData.contact_email,
          contact_phone: migrationData.contact_phone,
          store_size: migrationData.store_size,
          migration_type: migrationData.migration_type,
          notes: migrationData.notes,
          status: 'pending',
          priority: migrationData.store_size === 'large' ? 'high' : 'normal',
          estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
        })
        .select()
        .single()

      if (requestError) {
        console.error('Erreur lors de la création de la demande:', requestError)
        throw requestError
      }

      // Créer les étapes de migration
      const migrationSteps = [
        { name: 'Validation des données Shopify', order: 1 },
        { name: 'Export des produits', order: 2, enabled: migrationData.migration_type.products },
        { name: 'Export des clients', order: 3, enabled: migrationData.migration_type.customers },
        { name: 'Export des commandes', order: 4, enabled: migrationData.migration_type.orders },
        { name: 'Mapping des données', order: 5 },
        { name: 'Import vers Sokoby', order: 6 },
        { name: 'Vérification et validation', order: 7 },
        { name: 'Migration terminée', order: 8 }
      ].filter(step => step.enabled !== false)

      const { error: stepsError } = await supabase
        .from('migration_steps')
        .insert(
          migrationSteps.map(step => ({
            migration_request_id: migrationRequest.id,
            step_name: step.name,
            step_order: step.order,
            status: 'pending'
          }))
        )

      if (stepsError) {
        console.error('Erreur lors de la création des étapes:', stepsError)
        throw stepsError
      }

      // Envoyer un email de confirmation
      await supabase.functions.invoke('send-email', {
        body: {
          to: migrationData.contact_email,
          subject: 'Demande de migration Shopify vers Sokoby - Confirmation',
          html: `
            <h2>Demande de migration reçue</h2>
            <p>Bonjour,</p>
            <p>Nous avons bien reçu votre demande de migration depuis Shopify vers Sokoby.</p>
            <h3>Détails de votre demande :</h3>
            <ul>
              <li><strong>Boutique Shopify :</strong> ${migrationData.shopify_store_url}</li>
              <li><strong>Taille de boutique :</strong> ${migrationData.store_size}</li>
              <li><strong>Éléments à migrer :</strong> ${Object.entries(migrationData.migration_type).filter(([_, v]) => v).map(([k, _]) => k).join(', ')}</li>
              <li><strong>Estimation :</strong> 7 jours ouvrés</li>
            </ul>
            <p>Notre équipe va examiner votre demande et vous contactera sous 24h pour planifier la migration.</p>
            <p>Vous pouvez suivre l'avancement de votre migration dans votre tableau de bord Sokoby.</p>
            <p>Cordialement,<br>L'équipe Sokoby</p>
          `
        }
      })

      // Notification pour l'équipe Sokoby
      await supabase.functions.invoke('send-email', {
        body: {
          to: 'migrations@sokoby.com',
          subject: `Nouvelle demande de migration Shopify - ${migrationData.store_size}`,
          html: `
            <h2>Nouvelle demande de migration</h2>
            <p><strong>ID de demande :</strong> ${migrationRequest.id}</p>
            <p><strong>Client :</strong> ${migrationData.contact_email}</p>
            <p><strong>Boutique Shopify :</strong> ${migrationData.shopify_store_url}</p>
            <p><strong>Taille :</strong> ${migrationData.store_size}</p>
            <p><strong>Téléphone :</strong> ${migrationData.contact_phone || 'Non fourni'}</p>
            <p><strong>Notes :</strong> ${migrationData.notes || 'Aucune'}</p>
            <p><strong>Éléments à migrer :</strong> ${Object.entries(migrationData.migration_type).filter(([_, v]) => v).map(([k, _]) => k).join(', ')}</p>
          `
        }
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          migration_request: migrationRequest,
          message: 'Demande de migration créée avec succès'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      // Récupérer les demandes de migration de l'utilisateur
      const { data: requests, error } = await supabase
        .from('migration_requests')
        .select(`
          *,
          migration_steps(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ requests }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Méthode non autorisée' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erreur dans shopify-migration:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur serveur' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
