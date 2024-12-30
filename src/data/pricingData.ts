export const pricingPlans = {
  starter: {
    name: "Démarrage",
    price: 11,
    features: [
      "Jusqu'à 100 produits",
      "Support par email",
      "Analyses de base",
      "Personnalisation limitée"
    ],
    cta: "Commencer gratuitement",
    popular: false
  },
  pro: {
    name: "Pro",
    price: 19,
    features: [
      "Produits illimités",
      "Support prioritaire",
      "Analyses avancées", 
      "Personnalisation complète",
      "Domaine personnalisé"
    ],
    cta: "Essayer Pro",
    popular: true
  },
  enterprise: {
    name: "Entreprise",
    price: 49,
    features: [
      "Tout dans Pro",
      "Support dédié 24/7",
      "API personnalisée",
      "Formation sur mesure",
      "SLA garanti"
    ],
    cta: "Contacter les ventes",
    popular: false
  }
}

// Calcul des prix annuels avec 2 mois gratuits
export const getAnnualPrice = (monthlyPrice: number) => {
  return monthlyPrice * 10; // 12 mois - 2 mois gratuits = 10 mois facturés
}