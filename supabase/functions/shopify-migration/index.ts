
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MigrationRequest {
  source_platform: string
  store_url: string
  shopify_store_url?: string
  shopify_access_token?: string
  api_credentials?: {
    access_token?: string
    api_key?: string
    username?: string
    password?: string
    database_host?: string
    database_name?: string
    admin_url?: string
  }
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

const getPlatformSteps = (platform: string, migrationTypes: any) => {
  const baseSteps = [
    { name: `Validation des données ${platform}`, order: 1 },
    { name: 'Mapping des données', order: 5 },
    { name: 'Import vers Sokoby', order: 6 },
    { name: 'Vérification et validation', order: 7 },
    { name: 'Migration terminée', order: 8 }
  ];

  const platformSpecificSteps: { [key: string]: any[] } = {
    shopify: [
      { name: 'Export des produits Shopify', order: 2, enabled: migrationTypes.products },
      { name: 'Export des clients Shopify', order: 3, enabled: migrationTypes.customers },
      { name: 'Export des commandes Shopify', order: 4, enabled: migrationTypes.orders }
    ],
    woocommerce: [
      { name: 'Connexion à WordPress', order: 2 },
      { name: 'Export des produits WooCommerce', order: 3, enabled: migrationTypes.products },
      { name: 'Export des clients WordPress', order: 4, enabled: migrationTypes.customers },
      { name: 'Export des commandes WooCommerce', order: 5, enabled: migrationTypes.orders }
    ],
    bigcommerce: [
      { name: 'Export des produits BigCommerce', order: 2, enabled: migrationTypes.products },
      { name: 'Export des clients BigCommerce', order: 3, enabled: migrationTypes.customers },
      { name: 'Export des commandes BigCommerce', order: 4, enabled: migrationTypes.orders }
    ],
    squarespace: [
      { name: 'Préparation export Squarespace', order: 2 },
      { name: 'Export manuel des données', order: 3 },
      { name: 'Traitement des fichiers CSV', order: 4 }
    ],
    magento: [
      { name: 'Analyse de la base Magento', order: 2 },
      { name: 'Export des produits Magento', order: 3, enabled: migrationTypes.products },
      { name: 'Export des clients Magento', order: 4, enabled: migrationTypes.customers },
      { name: 'Export des commandes Magento', order: 5, enabled: migrationTypes.orders }
    ],
    volusion: [
      { name: 'Génération des exports CSV', order: 2 },
      { name: 'Traitement des fichiers Volusion', order: 3 },
      { name: 'Validation des données', order: 4 }
    ]
  };

  const specificSteps = platformSpecificSteps[platform] || [];
  const allSteps = [...baseSteps, ...specificSteps]
    .filter(step => step.enabled !== false)
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({ ...step, order: index + 1 }));

  return allSteps;
};

const getEstimatedDays = (platform: string, storeSize: string) => {
  const baseDays: { [key: string]: { [key: string]: number } } = {
    shopify: { small: 5, medium: 7, large: 10 },
    woocommerce: { small: 7, medium: 10, large: 14 },
    bigcommerce: { small: 5, medium: 7, large: 10 },
    squarespace: { small: 7, medium: 10, large: 14 },
    magento: { small: 10, medium: 14, large: 21 },
    volusion: { small: 7, medium: 10, large: 14 }
  };

  return baseDays[platform]?.[storeSize] || 7;
};

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

      const estimatedDays = getEstimatedDays(migrationData.source_platform, migrationData.store_size);

      // Créer la demande de migration
      const { data: migrationRequest, error: requestError } = await supabase
        .from('migration_requests')
        .insert({
          user_id: user.id,
          source_platform: migrationData.source_platform,
          shopify_store_url: migrationData.shopify_store_url || migrationData.store_url,
          shopify_access_token: migrationData.shopify_access_token || migrationData.api_credentials?.access_token,
          contact_email: migrationData.contact_email,
          contact_phone: migrationData.contact_phone,
          store_size: migrationData.store_size,
          migration_type: migrationData.migration_type,
          notes: `Plateforme source: ${migrationData.source_platform}\nURL: ${migrationData.store_url}\n${migrationData.notes || ''}`,
          status: 'pending',
          priority: migrationData.store_size === 'large' ? 'high' : 'normal',
          estimated_completion_date: new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000)
        })
        .select()
        .single()

      if (requestError) {
        console.error('Erreur lors de la création de la demande:', requestError)
        throw requestError
      }

      // Créer les étapes de migration spécifiques à la plateforme
      const migrationSteps = getPlatformSteps(migrationData.source_platform, migrationData.migration_type);

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

      // Envoyer un email de confirmation personnalisé par plateforme
      const platformNames: { [key: string]: string } = {
        shopify: 'Shopify',
        woocommerce: 'WooCommerce',
        bigcommerce: 'BigCommerce',
        squarespace: 'Squarespace',
        magento: 'Magento 2',
        volusion: 'Volusion'
      };

      await supabase.functions.invoke('send-email', {
        body: {
          to: [migrationData.contact_email],
          subject: `Migration ${platformNames[migrationData.source_platform]} vers Sokoby - Confirmation`,
          html: `
            <h2>Demande de migration reçue</h2>
            <p>Bonjour,</p>
            <p>Nous avons bien reçu votre demande de migration depuis <strong>${platformNames[migrationData.source_platform]}</strong> vers Sokoby.</p>
            <h3>Détails de votre demande :</h3>
            <ul>
              <li><strong>Plateforme source :</strong> ${platformNames[migrationData.source_platform]}</li>
              <li><strong>URL de votre boutique :</strong> ${migrationData.store_url}</li>
              <li><strong>Taille de boutique :</strong> ${migrationData.store_size}</li>
              <li><strong>Éléments à migrer :</strong> ${Object.entries(migrationData.migration_type).filter(([_, v]) => v).map(([k, _]) => k).join(', ')}</li>
              <li><strong>Estimation :</strong> ${estimatedDays} jours ouvrés</li>
            </ul>
            <p>Notre équipe spécialisée en migration ${platformNames[migrationData.source_platform]} va examiner votre demande et vous contactera sous 24h pour planifier la migration.</p>
            <p>Vous pouvez suivre l'avancement de votre migration dans votre tableau de bord Sokoby.</p>
            <p>Cordialement,<br>L'équipe Sokoby Migration</p>
          `
        }
      })

      // Notification pour l'équipe Sokoby
      await supabase.functions.invoke('send-email', {
        body: {
          to: ['migrations@sokoby.com'],
          subject: `Nouvelle migration ${platformNames[migrationData.source_platform]} - ${migrationData.store_size}`,
          html: `
            <h2>Nouvelle demande de migration ${platformNames[migrationData.source_platform]}</h2>
            <p><strong>ID de demande :</strong> ${migrationRequest.id}</p>
            <p><strong>Client :</strong> ${migrationData.contact_email}</p>
            <p><strong>Plateforme source :</strong> ${platformNames[migrationData.source_platform]}</p>
            <p><strong>URL de la boutique :</strong> ${migrationData.store_url}</p>
            <p><strong>Taille :</strong> ${migrationData.store_size}</p>
            <p><strong>Téléphone :</strong> ${migrationData.contact_phone || 'Non fourni'}</p>
            <p><strong>Estimation :</strong> ${estimatedDays} jours</p>
            <p><strong>Notes :</strong> ${migrationData.notes || 'Aucune'}</p>
            <p><strong>Éléments à migrer :</strong> ${Object.entries(migrationData.migration_type).filter(([_, v]) => v).map(([k, _]) => k).join(', ')}</p>
            ${migrationData.api_credentials ? '<p><strong>Accès API fournis :</strong> Oui</p>' : '<p><strong>Accès API fournis :</strong> Non - Contact nécessaire</p>'}
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
