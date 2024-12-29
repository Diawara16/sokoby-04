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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
          Nos fonctionnalités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const featureItem = t.features?.items?.[index];
            if (!featureItem) return null;
            
            return (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border-none bg-gray-50 text-center">
                <div className="flex justify-center">
                  <feature.icon className={`h-12 w-12 ${feature.iconColor} mb-6`} />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {index === 0 && "Gestion des produits"}
                  {index === 1 && "Paiements sécurisés"}
                  {index === 2 && "Analyses avancées"}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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