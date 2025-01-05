import { PricingPlanData } from "@/types/theme";

export const pricingPlans: PricingPlanData[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Pour démarrer votre boutique en ligne",
    price: 11,
    features: [
      "Jusqu'à 100 produits",
      "Support par email",
      "Analyses de base",
      "Paiements sécurisés",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les entreprises en croissance",
    price: 29,
    features: [
      "Produits illimités",
      "Support prioritaire",
      "Analyses avancées",
      "Intégrations marketplaces",
      "Personnalisation avancée",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Entreprise",
    description: "Pour les grandes entreprises",
    price: 99,
    features: [
      "Tout dans Pro",
      "Support dédié 24/7",
      "API personnalisée",
      "Déploiement sur mesure",
      "Formation équipe",
      "SLA garanti",
    ],
  },
];