import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface BlogPost {
  title: string
  content: string
  published_at: string
}

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("title, content, published_at")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle()

        if (error) throw error
        setPost(data)
      } catch (error) {
        console.error("Erreur lors du chargement de l'article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Chargement de l'article...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Article non trouvé</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <article className="prose prose-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8">
          {format(new Date(post.published_at), "d MMMM yyyy", {
            locale: fr,
          })}
        </p>
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}

export default BlogPost