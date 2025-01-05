import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { useStoreCreation } from "@/hooks/useStoreCreation";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

const CreerBoutiqueIA = () => {
  const { step, progress, error, storeUrl, handleNicheSelect, handleComplete } = useStoreCreation();
  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Créer votre boutique IA</h1>
        
        {step === 'niche' && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Sélectionnez une niche pour votre boutique. Notre IA générera automatiquement des produits adaptés.
            </p>
            <NicheSelector 
              onSelectNiche={handleNicheSelect}
              selectedNiche=""
            />
          </div>
        )}

        {step === 'progress' && (
          <CreationProgress 
            progress={progress}
            currentStep="creation"
          />
        )}

        {step === 'complete' && (
          <div className="space-y-6 text-center">
            <div className="bg-green-50 text-green-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">🎉 Félicitations !</h2>
              <p className="text-lg mb-4">
                Votre boutique a été créée avec succès.
              </p>
              {storeUrl && (
                <p className="text-sm text-muted-foreground mb-4">
                  Votre boutique est accessible à l'adresse : 
                  <a 
                    href={storeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-2"
                  >
                    {storeUrl}
                  </a>
                </p>
              )}
              <button
                onClick={handleComplete}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
              >
                Aller au tableau de bord
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;