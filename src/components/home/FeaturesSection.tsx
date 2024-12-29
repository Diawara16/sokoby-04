import { Card } from "@/components/ui/card";
import { ShoppingBag, BarChart3, Globe2 } from "lucide-react";
import { translations } from "@/translations";

const features = [
  {
    icon: ShoppingBag,
  },
  {
    icon: BarChart3,
  },
  {
    icon: Globe2,
  },
];

interface FeaturesSectionProps {
  currentLanguage: string;
}

export const FeaturesSection = ({ currentLanguage }: FeaturesSectionProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-900">
          {t.features.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border-none bg-gray-50">
              <feature.icon className="h-12 w-12 text-red-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {t.features.items[index].title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.features.items[index].description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};