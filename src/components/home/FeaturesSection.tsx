import { Card } from "@/components/ui/card";
import { ShoppingBag, BarChart3, Globe2 } from "lucide-react";
import { translations } from "@/translations";

const features = [
  {
    icon: ShoppingBag,
    iconColor: "text-red-600",
  },
  {
    icon: BarChart3,
    iconColor: "text-red-600",
  },
  {
    icon: Globe2,
    iconColor: "text-red-600",
  },
];

interface FeaturesSectionProps {
  currentLanguage: string;
}

export const FeaturesSection = ({ currentLanguage }: FeaturesSectionProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  if (!t || !t.features || !t.features.items) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
          Nos fonctionnalités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const featureItem = t.features?.items?.[index];
            if (!featureItem) return null;
            
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-none bg-gray-50 text-center">
                <div className="flex justify-center">
                  <feature.icon className={`h-10 w-10 ${feature.iconColor} mb-4`} />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {index === 0 && "Gestion des produits"}
                  {index === 1 && "Paiements sécurisés"}
                  {index === 2 && "Analyses avancées"}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {index === 0 && "Gérez facilement tous vos catalogues de produits"}
                  {index === 1 && "Acceptez les paiements en toute sécurité"}
                  {index === 2 && "Suivez vos performances en temps réel"}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};