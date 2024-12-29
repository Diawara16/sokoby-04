import { useState } from "react";
import { PricingPlan } from "@/components/pricing/PricingPlan";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PricingPlansProps {
  currentLanguage: string;
  onSubscribe: (planType: 'starter' | 'pro' | 'enterprise', paymentMethod: 'card' | 'apple_pay' | 'google_pay') => void;
}

export const PricingPlans = ({ currentLanguage, onSubscribe }: PricingPlansProps) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPlans = [
    {
      name: "Démarrage",
      price: "$11",
      period: "par mois",
      description: "Pour démarrer votre boutique en ligne",
      planType: "starter" as const,
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
      trial: true,
    },
    {
      name: "Pro",
      price: "$19",
      period: "par mois",
      description: "Pour les entreprises en croissance",
      planType: "pro" as const,
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
      trial: true,
    },
    {
      name: "Entreprise",
      price: "$49",
      period: "par mois",
      description: "Pour les grandes entreprises",
      planType: "enterprise" as const,
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
      trial: true,
    },
  ];

  const annualPlans = [
    {
      ...monthlyPlans[0],
      price: "$99",
      period: "par an",
      description: "Pour démarrer votre boutique en ligne (2 mois gratuits)",
    },
    {
      ...monthlyPlans[1],
      price: "$171",
      period: "par an",
      description: "Pour les entreprises en croissance (2 mois gratuits)",
    },
    {
      ...monthlyPlans[2],
      price: "$441",
      period: "par an",
      description: "Pour les grandes entreprises (2 mois gratuits)",
    },
  ];

  const plans = isAnnual ? annualPlans : monthlyPlans;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing-toggle" className="text-sm font-medium">
          Mensuel
        </Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="billing-toggle" className="text-sm font-medium">
            Annuel
          </Label>
          <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
            -17%
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingPlan
            key={plan.name + plan.period}
            {...plan}
            onSubscribe={onSubscribe}
            currentLanguage={currentLanguage}
          />
        ))}
      </div>
    </div>
  );
};