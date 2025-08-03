
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import AuthenticatedPricingContent from "@/components/pricing/AuthenticatedPricingContent";
import UnauthenticatedPricingContent from "@/components/pricing/UnauthenticatedPricingContent";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { usePendingSubscription } from "@/hooks/usePendingSubscription";

const PlanTarifaire = () => {
  const { isAuthenticated, isLoading, hasProfile, profile } = useAuthAndProfile();
  const { handleSubscribe } = useSubscriptionHandler();
  const navigate = useNavigate();
  
  // Gérer la reprise d'abonnement après connexion
  usePendingSubscription();

  // Rediriger vers le dashboard si l'utilisateur a déjà accès
  useEffect(() => {
    if (isAuthenticated && profile) {
      const hasActiveSubscription = true; // À implémenter avec les données d'abonnement
      const trialEndsAt = profile.trial_ends_at;
      const isTrialActive = trialEndsAt && new Date(trialEndsAt) > new Date();
      
      if (hasActiveSubscription || isTrialActive) {
        navigate("/tableau-de-bord");
      }
    }
  }, [isAuthenticated, profile, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <PricingHeader 
        currentLanguage="fr"
        isAuthenticated={isAuthenticated}
        onShowAuthForm={() => {}} 
      />
      
      {isAuthenticated ? (
        <AuthenticatedPricingContent 
          hasProfile={hasProfile}
          onSubscribe={handleSubscribe}
        />
      ) : (
        <UnauthenticatedPricingContent 
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
};

export default PlanTarifaire;
