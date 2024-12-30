import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Target, History, Heart, Users, Building2, Mail, Phone, MapPin } from "lucide-react"

const QuiSommesNous = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Notre Histoire</h1>

            {/* Introduction */}
            <div className="prose max-w-none mb-12 text-center">
              <p className="text-lg text-muted-foreground">
                Sokoby est née d'une vision simple : rendre le commerce en ligne accessible à tous.
                Notre plateforme combine innovation et simplicité pour permettre aux entrepreneurs
                de concrétiser leurs ambitions commerciales.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-2 mb-12">
              {/* Vision */}
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Notre Vision</h2>
                      <p className="text-muted-foreground">
                        Nous imaginons un monde où chaque entrepreneur peut créer et gérer
                        sa boutique en ligne sans barrière technique, en se concentrant sur
                        ce qui compte vraiment : développer son activité.
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
                      <h2 className="text-2xl font-semibold mb-2">Notre Parcours</h2>
                      <p className="text-muted-foreground">
                        Depuis 2023, nous développons des solutions innovantes pour
                        simplifier la création et la gestion de boutiques en ligne,
                        en restant à l'écoute des besoins de nos utilisateurs.
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
                        Innovation, simplicité et satisfaction client sont au cœur de
                        notre approche. Nous croyons en la création d'outils puissants
                        mais accessibles, adaptés à tous les niveaux d'expertise.
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
                        Notre équipe diversifiée rassemble des experts passionnés
                        par l'e-commerce et l'expérience utilisateur, unis par la
                        volonté de créer la meilleure plateforme possible.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-2xl font-semibold">Contactez-nous</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email:</p>
                          <a href="mailto:support@sokoby.com" className="hover:text-primary transition-colors">
                            support@sokoby.com
                          </a>
                          <br />
                          <a href="mailto:contact@sokoby.com" className="hover:text-primary transition-colors">
                            contact@sokoby.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone:</p>
                          <a href="tel:+15145127993" className="hover:text-primary transition-colors">
                            +1 514 512 7993
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Adresse:</p>
                          <p>7188 Rue Saint-hubert</p>
                          <p>H2R2N1, Montréal, Québec</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuiSommesNous