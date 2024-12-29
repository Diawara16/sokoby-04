import { useLanguageContext } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useState, useEffect } from "react";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";
import { PricingPlans } from "@/components/pricing/PricingPlans";

const PlanTarifaire = () => {
  const { currentLanguage } = useLanguageContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
      } finally {
        setIsLoading(false);
      }
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
      <PricingHeader
        currentLanguage={currentLanguage}
        isAuthenticated={isAuthenticated}
        onShowAuthForm={() => setShowAuthForm(true)}
      />
      <PricingPlans
        currentLanguage={currentLanguage}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default PlanTarifaire;