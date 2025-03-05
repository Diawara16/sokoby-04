
interface PricingFeature {
  name: string;
  description: string;
}

export interface PricingPlanData {
  name: string;
  price: string;
  period: string;
  description: string;
  planType: 'starter' | 'pro' | 'enterprise';
  features: string[];
  popular?: boolean;
  trial?: string;
}

export const getMonthlyPlans = (): PricingPlanData[] => [
  {
    name: "Basic",
    price: "11",
    period: "/mois",
    description: "Pour démarrer votre boutique en ligne",
    planType: "starter",
    features: [
      "1 boutique en ligne",
      "Jusqu'à 100 produits",
      "2 Go de stockage photos",
      "Support par email",
      "Analytics de base",
      "Paiements sécurisés",
      "Domaine personnalisé",
      "Thèmes standards",
      "Sauvegarde quotidienne"
    ],
    trial: "Essai gratuit de 14 jours"
  },
  {
    name: "Pro",
    price: "25",
    period: "/mois",
    description: "Pour les entreprises en croissance",
    planType: "pro",
    features: [
      "3 boutiques en ligne",
      "Produits illimités",
      "10 Go de stockage photos",
      "Support prioritaire",
      "Analytics avancés",
      "Paiements sécurisés",
      "Domaine personnalisé",
      "Thèmes premium",
      "API personnalisée",
      "Intégration des médias sociaux",
      "SEO optimisé",
      "Tableau de bord avancé"
    ],
    popular: true,
    trial: "Essai gratuit de 14 jours"
  },
  {
    name: "Enterprise",
    price: "97",
    period: "/mois",
    description: "Pour les grandes entreprises",
    planType: "enterprise",
    features: [
      "Boutiques illimitées",
      "Produits illimités",
      "Stockage illimité",
      "Support dédié 24/7",
      "Analytics en temps réel",
      "API personnalisée",
      "Formation dédiée",
      "SLA garanti",
      "Migration assistée",
      "Thèmes exclusifs",
      "Optimisation SEO avancée",
      "Intégration CRM",
      "Console d'administration avancée"
    ],
    trial: "Essai gratuit de 14 jours"
  }
];

export const getAnnualPlans = (monthlyPlans: PricingPlanData[]): PricingPlanData[] =>
  monthlyPlans.map(plan => ({
    ...plan,
    price: `${Math.floor(Number(plan.price) * 10)}`,
    period: "/an",
    description: `${plan.description} (2 mois gratuits)`,
  }));
