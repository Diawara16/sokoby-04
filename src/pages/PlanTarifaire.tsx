import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { PricingPlan } from "@/components/pricing/PricingPlan";
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";

const PlanTarifaire = () => {
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_IN') {
        setShowAuthForm(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubscribe = async (planType: 'starter' | 'pro' | 'enterprise', paymentMethod: 'card' | 'apple_pay' | 'google_pay') => {
    try {
      console.log('Début de la création de la session de paiement...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('Utilisateur non connecté');
        setShowAuthForm(true);
        return;
      }

      console.log('Appel de la fonction create-checkout-session...');
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { planType, paymentMethod },
      });

      console.log('Réponse reçue:', { data, error });

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirection vers:', data.url);
        window.location.href = data.url;
      } else {
        console.error('Pas d\'URL de redirection dans la réponse');
        throw new Error('Pas d\'URL de redirection dans la réponse');
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

  if (showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm 
            defaultIsSignUp={false}
            onCancel={() => setShowAuthForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          {t.pricing.title}
        </h1>
        <p className="text-xl text-black mb-6">
          {t.pricing.subtitle}
        </p>
        {!isAuthenticated && (
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-4">
              Connectez-vous pour commencer votre abonnement
            </p>
            <Button 
              onClick={() => setShowAuthForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Se connecter
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingPlan
            key={plan.name}
            {...plan}
            onSubscribe={handleSubscribe}
            currentLanguage={currentLanguage}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanTarifaire;