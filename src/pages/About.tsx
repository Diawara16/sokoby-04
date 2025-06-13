
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Zap, Shield, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Notre Mission",
      description: "Démocratiser le commerce électronique en rendant la création de boutiques en ligne accessible à tous les entrepreneurs, peu importe leur niveau technique."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Nous utilisons l'intelligence artificielle et les dernières technologies pour simplifier et accélérer le processus de création de boutiques en ligne."
    },
    {
      icon: Shield,
      title: "Fiabilité",
      description: "Nos solutions sont sécurisées, fiables et conçues pour grandir avec votre business. Nous garantissons une disponibilité de 99.9%."
    },
    {
      icon: Users,
      title: "Support Client",
      description: "Notre équipe d'experts est disponible 24/7 pour vous accompagner dans votre réussite. Votre succès est notre priorité."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Boutiques créées" },
    { number: "50M€+", label: "Volume de ventes" },
    { number: "98%", label: "Satisfaction client" },
    { number: "24/7", label: "Support disponible" }
  ];

  const team = [
    {
      name: "Marie Dubois",
      role: "CEO & Co-fondatrice",
      description: "Experte en e-commerce avec 15 ans d'expérience. Ancienne directrice chez Shopify Europe."
    },
    {
      name: "Thomas Martin",
      role: "CTO & Co-fondateur",
      description: "Ingénieur full-stack passionné d'IA. Ancien lead developer chez Amazon Web Services."
    },
    {
      name: "Sophie Laurent",
      role: "Directrice Marketing",
      description: "Spécialiste du marketing digital et growth hacking. Accompagne les entrepreneurs vers le succès."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À propos de <span className="text-red-600">Sokoby</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Nous sommes une équipe passionnée dédiée à révolutionner le monde du commerce électronique. 
            Notre mission est de permettre à chaque entrepreneur de créer facilement sa boutique en ligne.
          </p>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Notre Histoire</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                Sokoby est née en 2023 d'un constat simple : créer une boutique en ligne était encore trop complexe 
                et coûteux pour de nombreux entrepreneurs. Nos fondateurs, Marie et Thomas, ont combiné leur expertise 
                en e-commerce et en intelligence artificielle pour créer une solution révolutionnaire.
              </p>
              <p className="mb-6">
                En moins de deux ans, nous avons aidé plus de 10,000 entrepreneurs à lancer leur boutique en ligne, 
                générant ensemble plus de 50 millions d'euros de chiffre d'affaires. Notre secret ? Une plateforme 
                qui utilise l'IA pour automatiser 90% du processus de création.
              </p>
              <p>
                Aujourd'hui, Sokoby continue d'innover pour rester à la pointe de la technologie e-commerce, 
                avec une équipe de 25 experts basée à Paris et des utilisateurs dans plus de 30 pays.
              </p>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <value.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Notre Équipe */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Notre Équipe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-red-600 font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nos Certifications */}
        <section className="mb-16">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Certifications & Partenariats</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Award className="h-12 w-12 text-red-600 mb-3" />
                <h3 className="font-semibold">ISO 27001</h3>
                <p className="text-sm text-gray-600">Sécurité des données</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 text-red-600 mb-3" />
                <h3 className="font-semibold">RGPD Compliant</h3>
                <p className="text-sm text-gray-600">Protection des données</p>
              </div>
              <div className="flex flex-col items-center">
                <Globe className="h-12 w-12 text-red-600 mb-3" />
                <h3 className="font-semibold">Partenaire Stripe</h3>
                <p className="text-sm text-gray-600">Paiements sécurisés</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center bg-red-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6">Prêt à rejoindre l'aventure ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez les milliers d'entrepreneurs qui ont fait confiance à Sokoby pour réussir en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Commencer maintenant
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-red-600">
                Nous contacter
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
