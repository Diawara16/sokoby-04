import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { StoreExamples } from "@/components/store-creator/StoreExamples";
import { useStoreCreation } from "@/hooks/useStoreCreation";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";
import { VendorAssistant } from "@/components/ai/VendorAssistant";
import { PriceOptimizer } from "@/components/ai/PriceOptimizer";
import { ProductImageGenerator } from "@/components/ai/ProductImageGenerator";
import { MarketingTools } from "@/components/ai/MarketingTools";
import { StoreHeader } from "@/components/store-creator/StoreHeader";
import { ErrorDisplay } from "@/components/store-creator/ErrorDisplay";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { StoreSettingsForm } from "@/components/store-creator/StoreSettingsForm";

const CreerBoutiqueIA = () => {
  const {
    step,
    processStep,
    isLoading,
    progress,
    error,
    storeUrl,
    handleNicheSelect,
    handleComplete
  } = useStoreCreation();

  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour créer une boutique",
          variant: "destructive",
        });
        navigate("/connexion");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleStoreCreation = async (niche: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer une boutique",
        variant: "destructive",
      });
      navigate("/connexion");
      return;
    }

    try {
      handleNicheSelect(niche);
    } catch (error) {
      console.error('Erreur lors de la création de la boutique:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la boutique",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Chargement..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    if (isLoading && step === 'niche') {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner message="Initialisation..." />
        </div>
      );
    }

    switch (step) {
      case 'progress':
        return (
          <CreationProgress 
            progress={progress} 
            currentStep={processStep}
          />
        );
      case 'complete':
        return (
          <CreationComplete
            storeUrl={storeUrl || ''}
            productsCount={20}
            onComplete={handleComplete}
          />
        );
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <StoreHeader />
              <div className="grid gap-6 md:grid-cols-2">
                <VendorAssistant />
                <PriceOptimizer />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <ProductImageGenerator />
                <MarketingTools />
              </div>
              <StoreSettingsForm />
              <NicheSelector
                selectedNiche=""
                onSelectNiche={handleStoreCreation}
              />
              <StoreExamples />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto">
        <ErrorDisplay error={error} />
        {renderContent()}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;