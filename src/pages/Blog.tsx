import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Link } from "react-router-dom"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  published_at: string
  slug: string
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, published_at, slug")
          .eq("status", "published")
          .order("published_at", { ascending: false })

        if (error) throw error
        setPosts(data || [])
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Chargement des articles...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  {format(new Date(post.published_at), "d MMMM yyyy", {
                    locale: fr,
                  })}
                </p>
                <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Blog