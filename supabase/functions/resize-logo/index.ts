import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import ImageMagick from 'https://deno.land/x/imagemagick_deno@0.0.19/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting logo resize operation')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching original logo')
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('brand_assets')
      .download('logo.png')

    if (downloadError) {
      console.error('Error downloading logo:', downloadError)
      throw new Error('Logo original non trouvé')
    }

    if (!fileData) {
      throw new Error('Logo original non trouvé')
    }

    console.log('Converting logo to buffer')
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    console.log('Resizing logo')
    const resizedImage = await ImageMagick.resize(buffer, {
      width: 1024,
      height: 1024,
      fit: 'contain',
      background: 'white'
    })

    console.log('Uploading resized logo')
    const { data, error: uploadError } = await supabase.storage
      .from('brand_assets')
      .upload('facebook-logo.png', resizedImage, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading resized logo:', uploadError)
      throw uploadError
    }

    console.log('Getting public URL')
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
    console.error('Error in resize-logo function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})