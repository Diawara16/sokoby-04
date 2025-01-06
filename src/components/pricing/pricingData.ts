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
    name: "Démarrage",
    price: "$11",
    period: "par mois",
    description: "Pour démarrer votre boutique en ligne",
    planType: "starter",
    features: [
      "1 boutique en ligne",
      "Jusqu'à 100 produits",
      "2 Go de stockage photos",
      "Gestion des éléments de marque basique",
      "Support par email",
      "Analytics de base",
      "Thèmes standards",
      "Paiements sécurisés",
      "Domaine personnalisé",
    ],
    trial: "Essai gratuit de 14 jours",
  },
  {
    name: "Pro",
    price: "$25",
    period: "par mois",
    description: "Pour les entreprises en croissance",
    planType: "pro",
    features: [
      "1 boutique en ligne",
      "Produits illimités",
      "10 Go de stockage photos",
      "Gestion des éléments de marque avancée",
      "Support prioritaire",
      "Analytics avancés",
      "Thèmes premium",
      "Personnalisation avancée",
      "Domaine personnalisé",
      "Intégration des médias sociaux",
      "SEO optimisé",
      "Tableau de bord avancé",
    ],
    popular: true,
    trial: "Essai gratuit de 14 jours",
  },
  {
    name: "Entreprise",
    price: "$97",
    period: "par mois",
    description: "Pour les grandes entreprises",
    planType: "enterprise",
    features: [
      "1 boutique en ligne",
      "Produits illimités",
      "Stockage illimité",
      "Gestion des éléments de marque premium",
      "Support dédié 24/7",
      "Analytics en temps réel",
      "Thèmes exclusifs",
      "API personnalisée",
      "Formation dédiée",
      "SLA garanti",
      "Optimisation SEO avancée",
      "Intégration CRM",
      "Rapports personnalisés",
      "Backup quotidien",
      "Migration assistée",
      "Accès prioritaire aux nouvelles fonctionnalités",
      "Console d'administration avancée",
    ],
    trial: "Essai gratuit de 14 jours",
  },
];

export const getAnnualPlans = (monthlyPlans: PricingPlanData[]): PricingPlanData[] =>
  monthlyPlans.map(plan => ({
    ...plan,
    price: `$${Math.floor(Number(plan.price.replace('$', '')) * 10)}`,
    period: "par an",
    description: `${plan.description} (2 mois gratuits)`,
  }));