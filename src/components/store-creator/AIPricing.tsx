
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  buttonText: string;
  productCount: number;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Boutique Niche",
    price: 20,
    description: "Boutique spécialisée dans une niche spécifique",
    features: [
      "30 produits optimisés pour votre niche",
      "Design responsive automatique",
      "SEO optimisé par IA",
      "Descriptions produits générées",
      "Images optimisées",
      "Pages essentielles incluses",
      "Support par email"
    ],
    icon: <Sparkles className="w-6 h-6" />,
    buttonText: "Créer ma boutique niche",
    productCount: 30
  },
  {
    name: "Boutique Générale",
    price: 80,
    description: "Boutique multi-niches avec large catalogue",
    features: [
      "100+ produits variés",
      "Multi-catégories automatiques",
      "Design premium personnalisable",
      "SEO avancé multi-niches",
      "Système de recommandations IA",
      "Analytics intégrés",
      "Support prioritaire",
      "Mises à jour automatiques",
      "Intégrations marketing"
    ],
    popular: true,
    icon: <Zap className="w-6 h-6" />,
    buttonText: "Créer ma boutique générale",
    productCount: 100
  }
];

export const AIPricing = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          Choisissez votre type de boutique
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Notre IA génère automatiquement votre boutique complète avec tous les produits, 
          descriptions et optimisations nécessaires.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative p-8 ${plan.popular ? 'border-primary shadow-lg' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                Plus populaire
              </Badge>
            )}
            
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center text-primary">
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-primary">
                    ${plan.price}
                    <span className="text-lg text-gray-600 font-normal"> USD</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {plan.productCount} produits générés
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                size="lg"
                asChild
              >
                <Link to="/creer-boutique-ia">
                  {plan.buttonText}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-4 bg-gray-50 rounded-lg p-8">
        <h3 className="text-xl font-semibold">Pourquoi choisir notre IA ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium">Génération automatique</h4>
            <p className="text-sm text-gray-600">Boutique complète créée en quelques minutes</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium">Optimisation SEO</h4>
            <p className="text-sm text-gray-600">Référencement naturel optimisé par IA</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium">Prêt à vendre</h4>
            <p className="text-sm text-gray-600">Boutique immédiatement opérationnelle</p>
          </div>
        </div>
      </div>
    </div>
  );
};
