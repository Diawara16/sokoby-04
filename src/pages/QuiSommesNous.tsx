import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Target, History, Heart } from "lucide-react"

const QuiSommesNous = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Qui sommes-nous ?</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Notre Mission</h2>
                    <p className="text-muted-foreground">
                      Chez Sokoby, notre mission est de démocratiser le commerce en ligne 
                      en fournissant aux entrepreneurs les outils les plus innovants pour 
                      créer et gérer leurs boutiques en ligne avec facilité.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histoire */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <History className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Notre Histoire</h2>
                    <p className="text-muted-foreground">
                      Fondée en 2023, Sokoby est née de la vision d'une équipe passionnée 
                      qui souhaitait simplifier la création de boutiques en ligne. Depuis, 
                      nous n'avons cessé d'innover pour nos clients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valeurs */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Nos Valeurs</h2>
                    <p className="text-muted-foreground">
                      L'innovation, la simplicité et la satisfaction client sont au cœur 
                      de nos valeurs. Nous croyons en la création d'outils puissants mais 
                      faciles à utiliser, adaptés à tous les niveaux d'expertise.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Équipe */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Notre Équipe</h2>
                    <p className="text-muted-foreground">
                      Notre équipe diversifiée rassemble des experts en e-commerce, 
                      en technologie et en expérience utilisateur, tous unis par la 
                      passion de créer la meilleure plateforme possible pour nos clients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <Card className="mt-8 hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Nous Contacter</h2>
                  <p className="text-muted-foreground mb-4">
                    Nous sommes toujours ravis d'échanger avec nos clients et partenaires. 
                    N'hésitez pas à nous contacter pour toute question ou suggestion.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">Email: contact@sokoby.com</p>
                    <p className="text-sm">Téléphone: +33 (0)1 23 45 67 89</p>
                    <p className="text-sm">Adresse: 123 Avenue du Commerce, 75001 Paris</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default QuiSommesNous