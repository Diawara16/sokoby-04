import { ShoppingBag, Shield, BarChart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FeaturesSectionProps {
  currentLanguage: string;
}

export function FeaturesSection({ currentLanguage }: FeaturesSectionProps) {
  const shoppingCategories = [
    {
      title: "Shopping en Famille",
      image: "/lovable-uploads/2ad2e1d4-828a-4617-9e4a-f84ad4e9551e.png",
      alt: "Famille faisant du shopping ensemble"
    },
    {
      title: "Créez Votre Boutique",
      image: "/lovable-uploads/2ad2e1d4-828a-4617-9e4a-f84ad4e9551e.png",
      alt: "Couple créant leur boutique sur Sokoby"
    },
    {
      title: "Réussite Entrepreneuriale",
      image: "/lovable-uploads/2ad2e1d4-828a-4617-9e4a-f84ad4e9551e.png",
      alt: "Femme entrepreneur témoignant de son succès sur Sokoby"
    }
  ];

  const features = [
    {
      icon: <ShoppingBag className="h-12 w-12 text-[#ea384c]" />,
      title: "Gestion des produits",
      description: "Gérez facilement votre catalogue de produits"
    },
    {
      icon: <Shield className="h-12 w-12 text-[#ea384c]" />,
      title: "Paiements sécurisés",
      description: "Acceptez les paiements en toute sécurité"
    },
    {
      icon: <BarChart className="h-12 w-12 text-[#ea384c]" />,
      title: "Analyses avancées",
      description: "Suivez vos performances en temps réel"
    }
  ];

  return (
    <>
      {/* Shopping Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Inspirations Shopping
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shoppingCategories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <AspectRatio ratio={4/3}>
                    <img
                      src={category.image}
                      alt={category.alt}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-semibold text-center">{category.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
    </>
  );
}