import { ShoppingBag, Shield, BarChart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function FeaturesSection() {
  const shoppingCategories = [
    {
      title: "Shopping en Famille",
      image: "/lovable-uploads/8df8669b-0ee8-4a15-ba70-1119906d3be3.png",
      alt: "Famille heureuse faisant du shopping ensemble"
    },
    {
      title: "E-commerce Mobile",
      image: "/lovable-uploads/b7b5c43c-e2f5-4234-906c-311ac46974b2.png",
      alt: "Shopping sur mobile avec application e-commerce"
    },
    {
      title: "Réussite Entrepreneuriale",
      image: "/lovable-uploads/ba4f669d-b7c4-4458-bed7-3c6f6fe4cb97.png",
      alt: "Entrepreneurs témoignant de leur succès sur Sokoby"
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
