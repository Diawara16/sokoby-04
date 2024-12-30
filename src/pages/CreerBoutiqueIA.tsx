import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SupplierSelector } from "@/components/store-creator/SupplierSelector";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { niches } from "@/data/niches";

type Step = 'supplier' | 'niche' | 'creating' | 'done';

const CreerBoutiqueIA = () => {
  const [step, setStep] = useState<Step>('supplier');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSupplierSelect = (supplier: string) => {
    setSelectedSupplier(supplier);
    setStep('niche');
  };

  const handleNicheSelect = async (nicheName: string) => {
    setSelectedNiche(nicheName);
    setStep('creating');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Get store settings
      const { data: storeData, error: storeError } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (storeError) throw storeError;

      // Call the generate-store function
      const { data, error } = await supabase.functions.invoke('generate-store', {
        body: {
          niche: nicheName,
          supplier: selectedSupplier,
          storeId: storeData.id,
        },
      });

      if (error) throw error;

      setStep('done');
      toast({
        title: "Boutique créée avec succès !",
        description: "Votre boutique a été configurée avec les produits sélectionnés.",
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de la boutique:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la boutique.",
        variant: "destructive",
      });
      setStep('niche');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer votre boutique par IA</h1>
          <p className="text-muted-foreground">
            Notre IA va créer votre boutique en ligne en quelques minutes
          </p>
        </div>

        {step === 'supplier' && (
          <SupplierSelector
            selectedSupplier={selectedSupplier}
            onSupplierSelect={handleSupplierSelect}
          />
        )}

        {step === 'niche' && (
          <NicheSelector
            niches={niches}
            onNicheSelect={handleNicheSelect}
          />
        )}

        {step === 'creating' && (
          <CreationProgress
            message="Notre IA sélectionne les meilleurs produits pour votre boutique"
          />
        )}

        {step === 'done' && (
          <CreationComplete
            onGoToDashboard={() => window.location.href = '/dashboard'}
          />
        )}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;