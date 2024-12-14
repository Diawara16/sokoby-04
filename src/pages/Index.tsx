import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, BarChart3, Globe2 } from "lucide-react";

const features = [
  {
    title: "Boutique en ligne facile",
    description: "Créez votre boutique en ligne en quelques minutes, sans compétences techniques requises.",
    icon: ShoppingBag,
  },
  {
    title: "Analyses détaillées",
    description: "Suivez vos ventes et la performance de votre boutique avec des analyses en temps réel.",
    icon: BarChart3,
  },
  {
    title: "Présence mondiale",
    description: "Vendez partout dans le monde avec notre plateforme optimisée pour l'international.",
    icon: Globe2,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section avec Auth Form */}
      <section className="hero-gradient text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                Créez votre empire e-commerce
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-100">
                La plateforme tout-en-un pour lancer et développer votre boutique en ligne.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <AuthForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
            Tout ce dont vous avez besoin pour réussir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 card-hover">
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            Prêt à transformer votre vision en réalité ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Rejoignez des milliers d'entrepreneurs qui font confiance à notre plateforme.
          </p>
          <Button size="lg" className="bg-primary-700 text-white hover:bg-primary-800">
            Créer ma boutique
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;