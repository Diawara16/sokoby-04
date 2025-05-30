
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const QuiSommesNous = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Qui sommes-nous ?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sokoby est une plateforme innovante qui permet aux entrepreneurs de créer 
            et gérer leurs boutiques en ligne avec l'intelligence artificielle.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
              <p className="text-gray-600 mb-4">
                Nous démocratisons le e-commerce en rendant la création de boutiques en ligne 
                accessible à tous, grâce à l'intelligence artificielle et à des outils 
                intuitifs.
              </p>
              <p className="text-gray-600">
                Notre objectif est d'accompagner chaque entrepreneur dans sa réussite 
                digitale, peu importe son niveau technique.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">10K+</div>
                  <div className="text-gray-600">Boutiques créées</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                  <div className="text-gray-600">Pays couverts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">99%</div>
                  <div className="text-gray-600">Satisfaction client</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vos données et celles de vos clients sont protégées par les 
                  plus hauts standards de sécurité.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous croyons en la force du travail d'équipe et de la 
                  communauté pour réussir ensemble.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous intégrons les dernières technologies pour vous offrir 
                  toujours plus de possibilités.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Accessibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nos outils sont conçus pour être utilisables par tous, 
                  partout dans le monde.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Notre Équipe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center p-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-lg mb-2">Sarah Martin</h3>
                <p className="text-red-600 font-medium mb-2">CEO & Fondatrice</p>
                <p className="text-gray-600 text-sm">
                  Experte en e-commerce avec 10 ans d'expérience dans le retail digital.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-lg mb-2">Thomas Dubois</h3>
                <p className="text-red-600 font-medium mb-2">CTO</p>
                <p className="text-gray-600 text-sm">
                  Développeur passionné d'IA et d'innovation technologique.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-lg mb-2">Marie Leclerc</h3>
                <p className="text-red-600 font-medium mb-2">Head of Design</p>
                <p className="text-gray-600 text-sm">
                  Designer UX/UI spécialisée dans l'expérience utilisateur e-commerce.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-white rounded-lg p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à rejoindre notre communauté ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Commencez votre aventure e-commerce dès aujourd'hui avec notre essai gratuit.
          </p>
          <div className="space-x-4">
            <Link to="/essai-gratuit">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Essai Gratuit
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
