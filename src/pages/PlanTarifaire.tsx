import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { ReferralCard } from "@/components/referral/ReferralCard";
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";
import { useState, useEffect } from "react";

const PlanTarifaire = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (session) {
          // Simplified query to just check if the profile exists
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            setHasProfile(false);
          } else {
            setHasProfile(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubscribe = async (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour souscrire à un abonnement",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { planType, paymentMethod, couponCode }
      });

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la session de paiement",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur:', error);
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

  return (
    <div className="container mx-auto px-4 py-16">
      {isAuthenticated ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-12">Tableau de bord</h1>
          {hasProfile ? (
            <>
              <UserDashboard />
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-center mb-8">Nos Plans Tarifaires</h2>
                <PricingPlans currentLanguage="fr" onSubscribe={handleSubscribe} />
                <PlanComparison currentLanguage="fr" />
                <div className="mt-16">
                  <ReferralCard />
                </div>
                <PaymentHistory />
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profil non trouvé</h2>
              <p className="text-gray-600 mb-8">Impossible de charger votre profil</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-center mb-12">Nos Plans Tarifaires</h1>
          <PricingPlans currentLanguage="fr" onSubscribe={handleSubscribe} />
          <PlanComparison currentLanguage="fr" />
        </>
      )}
    </div>
  );
};

export default PlanTarifaire;