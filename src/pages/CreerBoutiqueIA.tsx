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
  const [currentStep, setCurrentStep] = useState<string>('init');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
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
    return (
      <div className="container mx-auto px-4 py-8">
        <CreationProgress 
          currentStep="init"
          progress={0}
          niche=""
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  const handleNext = () => {
    const steps = ['init', 'niche', 'marketplace', 'supplier', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps = ['init', 'niche', 'marketplace', 'supplier', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const getProgress = () => {
    const steps = ['init', 'niche', 'marketplace', 'supplier', 'complete'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'init':
        return (
          <StoreSettingsForm />
        );
      case 'niche':
        return (
          <NicheSelector
            selectedNiche=""
            onSelectNiche={(niche) => {
              console.log("Selected niche:", niche);
              handleNext();
            }}
          />
        );
      case 'marketplace':
        return (
          <MarketplaceSelector />
        );
      case 'supplier':
        return (
          <SupplierSelector
            selectedSupplier={null}
            onSupplierSelect={() => handleNext()}
          />
        );
      case 'complete':
        return (
          <CreationComplete
            storeUrl="https://votre-boutique.sokoby.com"
            productsCount={productsCount}
            onComplete={() => navigate('/tableau-de-bord')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CreationProgress
        currentStep={currentStep}
        progress={getProgress()}
        niche=""
      />
      <div className="mt-8">{renderStep()}</div>
    </div>
  );
};

export default CreerBoutiqueIA;