import { ShoppingBag, Shield, BarChart } from "lucide-react";

interface FeaturesSectionProps {
  currentLanguage: string;
}

export function FeaturesSection({ currentLanguage }: FeaturesSectionProps) {
  const features = [
    {
      icon: <ShoppingBag className="h-12 w-12 text-primary" />,
      title: "Gestion des produits",
      description: "Gérez facilement votre catalogue de produits"
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Paiements sécurisés",
      description: "Acceptez les paiements en toute sécurité"
    },
    {
      icon: <BarChart className="h-12 w-12 text-primary" />,
      title: "Analyses avancées",
      description: "Suivez vos performances en temps réel"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          Nos fonctionnalités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}