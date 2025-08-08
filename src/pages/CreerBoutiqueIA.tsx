
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { useStoreCreation } from "@/hooks/useStoreCreation";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreerBoutiqueIA = () => {
  const { step, processStep, progress, error, storeUrl, handleNicheSelect, handleComplete } = useStoreCreation();
  const { isAuthenticated, isLoading: authLoading } = useAuthAndProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNiche, setSelectedNiche] = useState("");

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour créer votre boutique IA personnalisée.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleNicheSelection = (niche: string) => {
    setSelectedNiche(niche);
    handleNicheSelect(niche);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tableau-de-bord">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Créer votre boutique IA</h1>
        </div>
        
        {step === 'niche' && (
          <NicheSelector 
            onSelectNiche={handleNicheSelection}
            selectedNiche={selectedNiche}
          />
        )}

        {step === 'progress' && (
          <div className="max-w-2xl mx-auto">
            <CreationProgress 
              progress={progress}
              processStep={processStep}
              error={error}
            />
            <div className="text-center mt-6">
              <p className="text-lg font-medium mb-2">
                Création de votre boutique "{selectedNiche}" en cours...
              </p>
              <p className="text-gray-600">
                Notre IA génère votre boutique et intègre les fournisseurs automatiquement.
              </p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6 text-center">
              <div className="bg-green-50 text-green-800 p-8 rounded-lg">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-4">Félicitations !</h2>
                <p className="text-lg mb-4">
                  Votre boutique "{selectedNiche}" a été créée avec succès.
                </p>
                <div className="bg-white p-4 rounded-md text-sm text-gray-600 mb-6">
                  <p className="font-medium mb-2">✅ Boutique générée automatiquement</p>
                  <p className="font-medium mb-2">✅ Fournisseurs intégrés</p>
                  <p className="font-medium mb-2">✅ Produits optimisés</p>
                  <p className="font-medium">✅ SEO configuré</p>
                </div>
                {storeUrl && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Votre boutique est accessible à l'adresse : 
                    <a 
                      href={storeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-2 font-medium"
                    >
                      {storeUrl}
                    </a>
                  </p>
                )}
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="bg-primary text-white px-8 py-3"
                >
                  Gérer ma boutique
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="font-medium">Erreur lors de la création</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;
