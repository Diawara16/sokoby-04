
import { PricingPlanData } from "@/types/theme";

export const pricingPlans: PricingPlanData[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Pour démarrer votre boutique en ligne",
    price: 11,
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
    isPopular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les entreprises en croissance",
    price: 25,
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
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Pour les grandes entreprises",
    price: 97,
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
    isPopular: false,
  },
];
