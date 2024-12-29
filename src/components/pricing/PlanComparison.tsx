import { Check, X } from "lucide-react";
import { translations } from "@/translations";

interface Feature {
  name: string;
  starter: boolean;
  pro: boolean;
  enterprise: boolean;
  description?: string;
}

const features: Feature[] = [
  {
    name: "Boutique en ligne",
    starter: true,
    pro: true,
    enterprise: true,
    description: "Créez et gérez votre boutique en ligne"
  },
  {
    name: "Nombre de produits",
    starter: true,
    pro: true,
    enterprise: true,
    description: "Starter: 20 produits, Pro: 100 produits, Enterprise: Illimité"
  },
  {
    name: "Support client",
    starter: true,
    pro: true,
    enterprise: true,
    description: "Starter: Email, Pro: Prioritaire, Enterprise: Support dédié 24/7"
  },
  {
    name: "Analytics",
    starter: true,
    pro: true,
    enterprise: true,
    description: "Starter: Base, Pro: Avancé, Enterprise: Temps réel"
  },
  {
    name: "Personnalisation avancée",
    starter: false,
    pro: true,
    enterprise: true,
    description: "Personnalisez l'apparence et les fonctionnalités de votre boutique"
  },
  {
    name: "Domaine personnalisé",
    starter: false,
    pro: true,
    enterprise: true,
    description: "Utilisez votre propre nom de domaine"
  },
  {
    name: "Intégration des médias sociaux",
    starter: false,
    pro: true,
    enterprise: true,
    description: "Connectez vos réseaux sociaux à votre boutique"
  },
  {
    name: "Gestion des stocks avancée",
    starter: false,
    pro: true,
    enterprise: true,
    description: "Gérez vos stocks de manière professionnelle"
  },
  {
    name: "API personnalisée",
    starter: false,
    pro: false,
    enterprise: true,
    description: "Accédez à notre API pour des intégrations personnalisées"
  },
  {
    name: "Formation dédiée",
    starter: false,
    pro: false,
    enterprise: true,
    description: "Bénéficiez d'une formation personnalisée"
  },
  {
    name: "SLA garanti",
    starter: false,
    pro: false,
    enterprise: true,
    description: "Garantie de temps de réponse et de disponibilité"
  },
  {
    name: "Optimisation SEO avancée",
    starter: false,
    pro: false,
    enterprise: true,
    description: "Outils avancés pour le référencement"
  }
];

interface PlanComparisonProps {
  currentLanguage: string;
}

export const PlanComparison = ({ currentLanguage }: PlanComparisonProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-center mb-4">
        Comparaison détaillée des fonctionnalités
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Tous nos plans sont disponibles en paiement mensuel ou annuel avec 2 mois gratuits
      </p>
      
      <div className="mt-8 space-y-8">
        <div className="grid grid-cols-4 gap-4 py-4 bg-gray-50 rounded-t-lg px-4">
          <div className="font-semibold">Fonctionnalité</div>
          <div className="text-center font-semibold">Starter</div>
          <div className="text-center font-semibold">Pro</div>
          <div className="text-center font-semibold">Enterprise</div>
        </div>
        
        {features.map((feature, index) => (
          <div key={index} className="group">
            <div className="grid grid-cols-4 gap-4 py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="relative">
                <span className="font-medium">{feature.name}</span>
                {feature.description && (
                  <div className="absolute left-0 top-full mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {feature.starter ? (
                  <Check className="text-green-500 h-6 w-6" />
                ) : (
                  <X className="text-gray-300 h-6 w-6" />
                )}
              </div>
              <div className="flex justify-center">
                {feature.pro ? (
                  <Check className="text-green-500 h-6 w-6" />
                ) : (
                  <X className="text-gray-300 h-6 w-6" />
                )}
              </div>
              <div className="flex justify-center">
                {feature.enterprise ? (
                  <Check className="text-green-500 h-6 w-6" />
                ) : (
                  <X className="text-gray-300 h-6 w-6" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};