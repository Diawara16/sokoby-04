import { AppSidebar } from "@/components/AppSidebar"
import AboutHeader from "@/components/about/AboutHeader"
import AboutCard from "@/components/about/AboutCard"
import ContactSection from "@/components/about/ContactSection"
import { Target, History, Heart, Users } from "lucide-react"

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

            <ContactSection />
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuiSommesNous