import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function BlogPostGenerator() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generatePost = async () => {
    if (!topic.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un sujet pour le blog post",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour générer un article",
          variant: "destructive",
        })
        return
      }

      const keywordsArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)

      const { data, error } = await supabase.functions.invoke('generate-blog-post', {
        body: { topic, keywords: keywordsArray }
      })

      if (error) throw error

      // Create the blog post in the database
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          seo_title: data.seoTitle,
          seo_description: data.seoDescription,
          seo_keywords: data.suggestedKeywords,
          slug: data.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
          status: 'draft',
          user_id: user.id
        })

      if (insertError) throw insertError

      toast({
        title: "Succès",
        description: "Article de blog généré avec succès",
      })

      setTopic("")
      setKeywords("")
    } catch (error) {
      console.error('Erreur lors de la génération:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Générer un Article de Blog</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sujet</label>
          <Input
            placeholder="Entrez le sujet de l'article..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mots-clés (séparés par des virgules)</label>
          <Textarea
            placeholder="e-commerce, vente en ligne, digital..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <Button 
          onClick={generatePost} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Génération en cours..." : "Générer l'article"}
        </Button>
      </CardContent>
    </Card>
  )
}