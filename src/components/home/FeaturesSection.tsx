import { ShoppingBag, Globe, Shield, Zap } from "lucide-react";

interface FeaturesSectionProps {
  currentLanguage: string;
}

export function FeaturesSection({ currentLanguage }: FeaturesSectionProps) {
  const features = [
    {
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
      title: "Gestion des produits",
      description: "Ajoutez, modifiez et gérez vos produits facilement avec notre interface intuitive."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Vente multicanale",
      description: "Vendez sur plusieurs plateformes et marketplaces depuis une seule interface."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Paiements sécurisés",
      description: "Acceptez les paiements en toute sécurité avec nos solutions intégrées."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Performance optimisée",
      description: "Une boutique rapide et optimisée pour convertir vos visiteurs en clients."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin pour réussir en ligne
          </h2>
          <p className="text-xl text-gray-600">
            Des outils puissants et faciles à utiliser pour développer votre business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}