
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import AuthenticatedPricingContent from "@/components/pricing/AuthenticatedPricingContent";
import UnauthenticatedPricingContent from "@/components/pricing/UnauthenticatedPricingContent";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { usePendingSubscription } from "@/hooks/usePendingSubscription";

const PlanTarifaire = () => {
  const { isAuthenticated, isLoading, hasProfile } = useAuthAndProfile();
  const { handleSubscribe } = useSubscriptionHandler();
  
  // Gérer la reprise d'abonnement après connexion
  usePendingSubscription();

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
