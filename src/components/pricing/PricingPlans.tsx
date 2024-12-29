import { PricingPlan } from "@/components/pricing/PricingPlan";

interface PricingPlansProps {
  currentLanguage: string;
  onSubscribe: (planType: 'starter' | 'pro' | 'enterprise', paymentMethod: 'card' | 'apple_pay' | 'google_pay') => void;
}

export const PricingPlans = ({ currentLanguage, onSubscribe }: PricingPlansProps) => {
  const plans = [
    {
      name: "Démarrage",
      price: "$11",
      period: "par mois",
      description: "Pour démarrer votre boutique en ligne",
      planType: "starter" as const,
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
      period: "par mois",
      description: "Pour les entreprises en croissance",
      planType: "pro" as const,
      features: [
        "3 boutiques en ligne",
        "Jusqu'à 500 produits",
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
      period: "par mois",
      description: "Pour les grandes entreprises",
      planType: "enterprise" as const,
      features: [
        "Boutiques en ligne illimitées",
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
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <PricingPlan
          key={plan.name}
          {...plan}
          onSubscribe={onSubscribe}
          currentLanguage={currentLanguage}
        />
      ))}
    </div>
  );
};