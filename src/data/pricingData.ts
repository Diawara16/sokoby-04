export const pricingPlans = {
  starter: {
    name: "Starter",
    price: 11,
    features: [
      "Up to 100 products",
      "Email support",
      "Basic analytics",
      "Limited customization"
    ],
    cta: "Start for free",
    popular: false
  },
  pro: {
    name: "Pro",
    price: 19,
    features: [
      "Unlimited products",
      "Priority support",
      "Advanced analytics", 
      "Full customization",
      "Custom domain"
    ],
    cta: "Try Pro",
    popular: true
  },
  enterprise: {
    name: "Enterprise",
    price: 49,
    features: [
      "Everything in Pro",
      "24/7 dedicated support",
      "Custom API",
      "Custom training",
      "SLA guarantee"
    ],
    cta: "Contact sales",
    popular: false
  }
}

// Calculate annual prices with 2 months free
export const getAnnualPrice = (monthlyPrice: number) => {
  return monthlyPrice * 10; // 12 months - 2 months free = 10 months charged
}