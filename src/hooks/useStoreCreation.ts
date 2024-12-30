import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type CreationStep = 'niche' | 'progress' | 'complete';

async function generateUniqueDomainName(userId: string, nicheName: string) {
  const cleanNiche = nicheName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanNiche}-${randomSuffix}`;
}

export const useStoreCreation = () => {
  const [step, setStep] = useState<CreationStep>('niche');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNicheSelect = async (nicheName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour créer une boutique");
      }

      // Passer à l'étape de progression
      setStep('progress');
      setProgress(20);

      const uniqueDomainName = await generateUniqueDomainName(user.id, nicheName);

      const { data: storeData, error: storeError } = await supabase
        .from('store_settings')
        .upsert({
          user_id: user.id,
          domain_name: uniqueDomainName,
          store_name: `${nicheName} Store`,
        })
        .select()
        .single();

      if (storeError) throw storeError;

      setProgress(40);

      const { data, error } = await supabase.functions.invoke('generate-store', {
        body: {
          niche: nicheName,
          storeId: storeData.id,
          userId: user.id,
        },
      });

      if (error) throw error;

      setProgress(100);
      setStoreUrl(`https://${uniqueDomainName}.sokoby.com`);
      setStep('complete');

    } catch (error: any) {
      console.error('Erreur lors de la création de la boutique:', error);
      setError(error.message);
      setStep('niche');
      toast({
        title: "Erreur",
        description: "Impossible de créer la boutique. Veuillez réessayer.",
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
    isLoading,
    progress,
    error,
    storeUrl,
    handleNicheSelect,
    handleComplete,
  };
};