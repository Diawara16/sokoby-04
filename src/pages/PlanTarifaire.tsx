import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard, Paypal } from "lucide-react";
import { translations } from "@/translations";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const PlanTarifaire = () => {
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (planType: 'starter' | 'pro' | 'enterprise', paymentMethod: 'card' | 'paypal' = 'card') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour souscrire à un abonnement",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planType, paymentMethod }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la session de paiement",
        variant: "destructive",
      });
    }
  };

  const plans = [
    {
      name: "Démarrage",
      price: "$11",
      period: t.pricing.perMonth,
      description: "Pour démarrer votre boutique en ligne",
      planType: "starter" as const,
      features: [
        "1 boutique en ligne",
        "Jusqu'à 20 produits",
        "Support par email",
        "Analytics de base",
      ],
      trial: true,
    },
    {
      name: "Pro",
      price: "$19",
      period: t.pricing.perMonth,
      description: "Pour les entreprises en croissance",
      planType: "pro" as const,
      features: [
        "1 boutique en ligne",
        "Jusqu'à 100 produits",
        "Support prioritaire",
        "Analytics avancés",
        "Personnalisation avancée",
        "Domaine personnalisé",
        "Intégration des médias sociaux",
        "Gestion des stocks avancée",
      ],
      popular: true,
      trial: true,
    },
    {
      name: "Entreprise",
      price: "$49",
      period: t.pricing.perMonth,
      description: "Pour les grandes entreprises",
      planType: "enterprise" as const,
      features: [
        "1 boutique en ligne premium",
        "Produits illimités",
        "Support dédié 24/7",
        "Analytics en temps réel",
        "API personnalisée",
        "Formation dédiée",
        "SLA garanti",
        "Optimisation SEO avancée",
        "Intégration CRM",
        "Rapports personnalisés",
        "Backup quotidien",
        "Migration assistée",
      ],
      trial: true,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          {t.pricing.title}
        </h1>
        <p className="text-xl text-black">
          {t.pricing.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative p-8 rounded-lg ${
              plan.popular
                ? "border-2 border-red-600 shadow-lg"
                : "border border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  {t.pricing.mostPopular}
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-bold text-black mb-2">
                {plan.name}
              </h3>
              <div className="flex justify-center items-baseline mb-2">
                <span className="text-5xl font-extrabold text-black">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-black ml-1">{plan.period}</span>
                )}
              </div>
              {plan.trial && (
                <div className="text-sm text-red-600 font-medium mb-2">
                  {t.pricing.freeTrial}
                </div>
              )}
              <p className="text-black mb-6">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-black">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-700 hover:bg-red-800 text-white"
                } transition-colors`}
                onClick={() => handleSubscribe(plan.planType, 'card')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {t.pricing.startTrial}
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 hover:bg-blue-50"
                onClick={() => handleSubscribe(plan.planType, 'paypal')}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 8.5h-2.5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2h-2.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 8.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14v2" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Payer avec PayPal
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanTarifaire;