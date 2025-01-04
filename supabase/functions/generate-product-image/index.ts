import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, description } = await req.json()
    console.log('Generating image for:', { prompt, description })

    // Initialize Hugging Face with your API token
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    console.log('Hugging Face client initialized')

    // Générer une description optimisée pour l'IA
    const enhancedPrompt = `Generate a professional product photo of ${prompt}. ${description}. Style: Professional, clean background, high-quality product photography, commercial ready`

    // Generate the image using FLUX model
    console.log('Generating image with FLUX model...')
    const generatedImage = await hf.textToImage({
      inputs: enhancedPrompt,
      model: 'black-forest-labs/FLUX.1-schnell',
      parameters: {
        negative_prompt: "watermark, blurry, distorted, low quality",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }
    })
    console.log('Image generated successfully')

    // Convert the blob to base64
    const arrayBuffer = await generatedImage.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const imageUrl = `data:image/png;base64,${base64}`
    console.log('Image converted to base64')

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})