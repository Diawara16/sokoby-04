
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
      "Jusqu'à 20 produits",
      "1 Go de stockage photos",
      "Sous-domaine gratuit (.sokoby.com)",
      "Support par email",
      "Analytics de base",
      "Paiements sécurisés (Stripe)",
      "3 thèmes standards",
      "Sauvegarde hebdomadaire",
      "SSL inclus"
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
      "1 boutique en ligne",
      "Produits illimités",
      "10 Go de stockage photos",
      "Domaine personnalisé inclus",
      "Support prioritaire",
      "Analytics avancés + rapports",
      "Tous les moyens de paiement",
      "Programme de fidélité",
      "Récupération paniers abandonnés",
      "Thèmes premium illimités",
      "Intégration réseaux sociaux",
      "SEO optimisé",
      "Code de réduction et promotions",
      "Frais de transaction réduits (2.4%)",
      "Sauvegarde quotidienne"
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
      "Multi-domaines inclus",
      "Support dédié 24/7",
      "Gestionnaire de compte personnel",
      "Analytics en temps réel + BI",
      "API personnalisée complète",
      "Formation dédiée (2h/mois)",
      "SLA garanti 99.9%",
      "Migration assistée gratuite",
      "Thèmes sur mesure",
      "Multi-utilisateurs et permissions",
      "Intégration ERP/CRM",
      "White-label disponible",
      "Optimisation SEO avancée",
      "A/B testing intégré",
      "Aucun frais de transaction",
      "Backup en temps réel"
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
