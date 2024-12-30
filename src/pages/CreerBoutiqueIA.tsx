import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";

const CreerBoutiqueIA = () => {
  const [selectedNiche, setSelectedNiche] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateStore = async () => {
    try {
      setIsCreating(true);
      setProgress(25);

      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      setProgress(50);

      // Récupérer les paramètres de la boutique
      const { data: storeSettings } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!storeSettings) {
        throw new Error("Paramètres de la boutique non trouvés");
      }

      setProgress(75);

      // Appeler la fonction Edge pour générer la boutique
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          niche: selectedNiche,
          storeId: storeSettings.id,
          userId: user.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la génération de la boutique");
      }

      const data = await response.json();
      setProductsCount(data.productsCount);
      setProgress(100);
      setIsComplete(true);

      toast({
        title: "Boutique créée avec succès",
        description: `${data.productsCount} produits ont été générés pour votre boutique.`,
      });
    } catch (error: any) {
      console.error("Erreur lors de la création de la boutique:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la boutique",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  const handleComplete = () => {
    navigate("/tableau-de-bord");
  };

  if (isComplete) {
    return <CreationComplete productsCount={productsCount} onComplete={handleComplete} />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Créer une boutique IA</h1>
      
      {isCreating ? (
        <CreationProgress progress={progress} />
      ) : (
        <div className="space-y-8">
          <NicheSelector
            selectedNiche={selectedNiche}
            onSelectNiche={setSelectedNiche}
          />
          
          <button
            onClick={handleCreateStore}
            disabled={!selectedNiche}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Créer ma boutique
          </button>
        </div>
      )}
    </div>
  );
};

export default CreerBoutiqueIA;