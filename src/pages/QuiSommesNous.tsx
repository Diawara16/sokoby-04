import { AppSidebar } from "@/components/AppSidebar"
import AboutHeader from "@/components/about/AboutHeader"
import AboutCard from "@/components/about/AboutCard"
import ContactSection from "@/components/about/ContactSection"
import { Target, History, Heart, Users, Truck, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const QuiSommesNous = () => {
  const aboutCards = [
    {
      icon: Target,
      title: "Notre Vision",
      description: "Nous imaginons un monde où chaque entrepreneur peut créer et gérer sa boutique en ligne sans barrière technique, en se concentrant sur ce qui compte vraiment : développer son activité."
    },
    {
      icon: History,
      title: "Notre Parcours",
      description: "Depuis 2023, nous développons des solutions innovantes pour simplifier la création et la gestion de boutiques en ligne, en restant à l'écoute des besoins de nos utilisateurs."
    },
    {
      icon: Heart,
      title: "Nos Valeurs",
      description: "Innovation, simplicité et satisfaction client sont au cœur de notre approche. Nous croyons en la création d'outils puissants mais accessibles, adaptés à tous les niveaux d'expertise."
    },
    {
      icon: Users,
      title: "Notre Équipe",
      description: "Notre équipe diversifiée rassemble des experts passionnés par l'e-commerce et l'expérience utilisateur, unis par la volonté de créer la meilleure plateforme possible."
    }
  ]

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <AboutHeader />
            
            <div className="grid gap-8 md:grid-cols-2 mb-12">
              {aboutCards.map((card, index) => (
                <AboutCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>

            <div className="space-y-8 mb-12">
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Livraison et Suivi</h2>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Nous nous engageons à offrir une expérience de livraison transparente :</p>
                        <ul className="list-disc list-inside ml-4">
                          <li>Suivi en temps réel de vos commandes</li>
                          <li>Notifications automatiques sur l'état de la livraison</li>
                          <li>Estimation précise des délais de livraison</li>
                          <li>Choix de transporteurs fiables</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Politique de Retours</h2>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Notre politique de retours est conçue pour votre tranquillité d'esprit :</p>
                        <ul className="list-disc list-inside ml-4">
                          <li>Retours acceptés sous 30 jours après réception</li>
                          <li>Processus de retour simple et rapide</li>
                          <li>Remboursement garanti pour les articles retournés en bon état</li>
                          <li>Support client dédié pour vous accompagner</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ContactSection />
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuiSommesNous