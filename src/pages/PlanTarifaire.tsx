import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import { translations } from "@/translations";
import { useLanguageContext } from "@/contexts/LanguageContext"; // Assurez-vous que ce contexte existe

const PlanTarifaire = () => {
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];

  const plans = [
    {
      name: "Démarrage",
      price: "$11",
      period: t.pricing.perMonth,
      description: "Pour démarrer votre boutique en ligne",
      features: [
        "1 boutique en ligne",
        "Jusqu'à 20 produits",
        "Support par email",
        "Analytics de base",
      ],
      trial: true,
    },
    {
      name: "Pro",
      price: "$19",
      period: t.pricing.perMonth,
      description: "Pour les entreprises en croissance",
      features: [
        "1 boutique en ligne",
        "Jusqu'à 100 produits",
        "Support prioritaire",
        "Analytics avancés",
        "Personnalisation avancée",
        "Domaine personnalisé",
        "Intégration des médias sociaux",
        "Gestion des stocks avancée",
      ],
      popular: true,
      trial: true,
    },
    {
      name: "Entreprise",
      price: "$49",
      period: t.pricing.perMonth,
      description: "Pour les grandes entreprises",
      features: [
        "1 boutique en ligne premium",
        "Produits illimités",
        "Support dédié 24/7",
        "Analytics en temps réel",
        "API personnalisée",
        "Formation dédiée",
        "SLA garanti",
        "Optimisation SEO avancée",
        "Intégration CRM",
        "Rapports personnalisés",
        "Backup quotidien",
        "Migration assistée",
      ],
      trial: true,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          {t.pricing.title}
        </h1>
        <p className="text-xl text-black">
          {t.pricing.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative p-8 rounded-lg ${
              plan.popular
                ? "border-2 border-red-600 shadow-lg"
                : "border border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  {t.pricing.mostPopular}
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-bold text-black mb-2">
                {plan.name}
              </h3>
              <div className="flex justify-center items-baseline mb-2">
                <span className="text-5xl font-extrabold text-black">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-black ml-1">{plan.period}</span>
                )}
              </div>
              {plan.trial && (
                <div className="text-sm text-red-600 font-medium mb-2">
                  {t.pricing.freeTrial}
                </div>
              )}
              <p className="text-black mb-6">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-black">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.popular
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-700 hover:bg-red-800 text-white"
              } transition-colors`}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {t.pricing.startTrial}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanTarifaire;