import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Sharp from 'https://esm.sh/sharp@0.32.6'

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

    // Récupérer le logo original depuis le bucket brand_assets
    const { data: fileData } = await supabase.storage
      .from('brand_assets')
      .download('logo.png')

    if (!fileData) {
      throw new Error('Logo original non trouvé')
    }

    // Convertir le blob en buffer
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Redimensionner l'image en 1024x1024
    const resizedImage = await Sharp(buffer)
      .resize(1024, 1024, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer()

    // Uploader la nouvelle version
    const { data, error: uploadError } = await supabase.storage
      .from('brand_assets')
      .upload('facebook-logo.png', resizedImage, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('brand_assets')
      .getPublicUrl('facebook-logo.png')

    return new Response(
      JSON.stringify({ 
        message: 'Logo redimensionné avec succès',
        url: publicUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})