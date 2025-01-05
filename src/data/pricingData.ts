import { PricingPlanData } from "@/types/theme"

export const getMonthlyPlans = (): PricingPlanData[] => [
  {
    name: "Démarrage",
    price: "$11",
    period: "par mois",
    description: "Pour démarrer votre boutique en ligne",
    planType: "starter",
    features: [
      "Jusqu'à 50 produits",
      "1 utilisateur",
      "Support par email",
      "Analyses de base",
      "Paiements en ligne",
      "Domaine personnalisé",
    ],
  },
  {
    name: "Croissance",
    price: "$29",
    period: "par mois",
    description: "Pour les boutiques en pleine croissance",
    planType: "growth",
    features: [
      "Jusqu'à 200 produits",
      "5 utilisateurs",
      "Support par chat",
      "Analyses avancées",
      "Paiements en ligne",
      "Domaine personnalisé",
    ],
  },
  {
    name: "Établissement",
    price: "$79",
    period: "par mois",
    description: "Pour les entreprises établies",
    planType: "established",
    features: [
      "Produits illimités",
      "Utilisateurs illimités",
      "Support prioritaire",
      "Analyses détaillées",
      "Paiements en ligne",
      "Domaine personnalisé",
    ],
  },
]
