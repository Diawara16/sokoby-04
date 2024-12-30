import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { useStoreCreation } from "@/hooks/useStoreCreation";

const CreerBoutiqueIA = () => {
  const {
    step,
    isLoading,
    progress,
    error,
    storeUrl,
    handleNicheSelect,
    handleComplete
  } = useStoreCreation();

  const renderContent = () => {
    switch (step) {
      case 'progress':
        return <CreationProgress progress={progress} />;
      case 'complete':
        return (
          <CreationComplete
            storeUrl={storeUrl}
            productsCount={20}
            onComplete={handleComplete}
          />
        );
      default:
        return (
          <div className="space-y-8">
            <NicheSelector
              selectedNiche=""
              onSelectNiche={handleNicheSelect}
            />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Créer une boutique IA</h1>
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default CreerBoutiqueIA;