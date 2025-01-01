import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { topic, keywords } = await req.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional blog post writer. Create SEO-optimized content that is engaging and informative.'
          },
          {
            role: 'user',
            content: `Write a blog post about ${topic}. Include these keywords: ${keywords.join(', ')}. 
                     Format the response as JSON with the following structure:
                     {
                       title: "The blog post title",
                       content: "The full blog post content in markdown format",
                       excerpt: "A brief excerpt",
                       seoTitle: "SEO optimized title",
                       seoDescription: "Meta description for SEO",
                       suggestedKeywords: ["array", "of", "additional", "keywords"]
                     }`
          }
        ],
      }),
    })

    const data = await response.json()
    const generatedContent = JSON.parse(data.choices[0].message.content)

    return new Response(
      JSON.stringify(generatedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating blog post:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})