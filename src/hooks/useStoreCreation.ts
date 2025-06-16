
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type CreationStep = 'niche' | 'progress' | 'complete';
type ProcessStep = 'init' | 'products' | 'store' | 'finalizing';

async function generateUniqueDomainName(userId: string, nicheName: string) {
  const cleanNiche = nicheName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanNiche}-${randomSuffix}`;
}

export const useStoreCreation = () => {
  const [step, setStep] = useState<CreationStep>('niche');
  const [processStep, setProcessStep] = useState<ProcessStep>('init');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateProgress = (newProgress: number, newStep: ProcessStep) => {
    setProgress(newProgress);
    setProcessStep(newStep);
  };

  const handleNicheSelect = async (nicheName: string) => {
    console.log("Début de handleNicheSelect avec niche:", nicheName);
    
    try {
      setIsLoading(true);
      setError(null);
      setStep('progress');
      
      // Étape 1: Initialisation
      updateProgress(10, 'init');
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Utilisateur récupéré:", user);
      
      if (!user) {
        throw new Error("Vous devez être connecté pour créer une boutique");
      }

      // Étape 2: Génération du nom de domaine
      updateProgress(25, 'init');
      console.log("Génération du nom de domaine unique...");
      const uniqueDomainName = await generateUniqueDomainName(user.id, nicheName);
      console.log("Nom de domaine généré:", uniqueDomainName);

      // Étape 3: Création/Mise à jour des paramètres de la boutique
      updateProgress(40, 'store');
      console.log("Création/Mise à jour des paramètres de la boutique...");
      
      // Utiliser upsert pour éviter les conflits de contrainte unique
      const { data: storeData, error: storeError } = await supabase
        .from('store_settings')
        .upsert({
          user_id: user.id,
          domain_name: uniqueDomainName,
          store_name: `${nicheName} Store`,
          store_email: user.email,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (storeError) {
        console.error("Erreur lors de la création/mise à jour des paramètres:", storeError);
        throw new Error(`Erreur lors de la configuration de la boutique: ${storeError.message}`);
      }

      console.log("Paramètres de boutique configurés:", storeData);

      // Étape 4: Génération des produits
      updateProgress(60, 'products');
      console.log("Appel de la fonction generate-store...");
      const { data, error } = await supabase.functions.invoke('generate-store', {
        body: {
          niche: nicheName,
          storeId: storeData.id,
          userId: user.id,
        },
      });

      if (error) {
        console.error("Erreur lors de la génération de la boutique:", error);
        throw new Error(`Erreur lors de la génération des produits: ${error.message}`);
      }

      // Étape 5: Finalisation
      updateProgress(90, 'finalizing');
      console.log("Boutique générée avec succès:", data);
      
      // Étape 6: Complet
      updateProgress(100, 'finalizing');
      setStoreUrl(`https://${uniqueDomainName}.sokoby.com`);
      setStep('complete');

      toast({
        title: "Boutique créée avec succès",
        description: `Votre boutique "${nicheName}" a été créée et configurée automatiquement.`,
      });

    } catch (error: any) {
      console.error('Erreur lors de la création de la boutique:', error);
      setError(error.message || "Une erreur inattendue s'est produite");
      setStep('niche');
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la boutique. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    navigate('/tableau-de-bord');
  };

  return {
    step,
    processStep,
    isLoading,
    progress,
    error,
    storeUrl,
    handleNicheSelect,
    handleComplete,
  };
};
