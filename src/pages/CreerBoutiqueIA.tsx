import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { StoreSettingsForm } from "@/components/store-creator/StoreSettingsForm";
import { MarketplaceSelector } from "@/components/store-creator/MarketplaceSelector";
import { SupplierSelector } from "@/components/store-creator/SupplierSelector";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { ErrorDisplay } from "@/components/store-creator/ErrorDisplay";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

const CreerBoutiqueIA = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        toast({
          title: "Authentification requise",
          description: "Veuillez vous connecter pour créer une boutique",
          variant: "destructive",
        });
      }
    };
    checkAuth();
  }, [navigate, toast]);

  if (authLoading) {
    return <CreationProgress step={0} totalSteps={4} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StoreSettingsForm
            onNext={() => setStep(2)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        );
      case 2:
        return (
          <NicheSelector
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        );
      case 3:
        return (
          <MarketplaceSelector
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        );
      case 4:
        return (
          <SupplierSelector
            onComplete={() => setStep(5)}
            onBack={() => setStep(3)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        );
      case 5:
        return <CreationComplete />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CreationProgress step={step} totalSteps={4} />
      <div className="mt-8">{renderStep()}</div>
    </div>
  );
};

export default CreerBoutiqueIA;