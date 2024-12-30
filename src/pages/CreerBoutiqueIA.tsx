import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { useStoreCreation } from "@/hooks/useStoreCreation";
import { LoadingSpinner } from "@/components/pricing/LoadingSpinner";

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

  const renderContent = () => {
    if (isLoading && step === 'niche') {
      return <LoadingSpinner message="Initialisation..." />;
    }

    switch (step) {
      case 'progress':
        return <CreationProgress 
          progress={progress} 
          currentStep={processStep}
        />;
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 font-heading">
                  Créez votre boutique en ligne
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Choisissez une niche et laissez l'IA créer une boutique personnalisée avec des produits pertinents.
                </p>
              </div>
              <NicheSelector
                selectedNiche=""
                onSelectNiche={handleNicheSelect}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto">
        {error ? (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
            <p className="font-medium">Une erreur est survenue</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;