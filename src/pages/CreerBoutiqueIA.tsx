import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SupplierSelector } from "@/components/store-creator/SupplierSelector";
import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { niches } from "@/data/niches";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = 'supplier' | 'niche' | 'creating' | 'done';

const CreerBoutiqueIA = () => {
  const [step, setStep] = useState<Step>('supplier');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSupplierSelect = (supplier: string) => {
    setSelectedSupplier(supplier);
    setStep('niche');
  };

  const generateUniqueDomainName = async (userId: string, nicheName: string) => {
    const baseDomain = nicheName.toLowerCase().replace(/\s+/g, '-');
    const timestamp = Date.now().toString().slice(-6);
    return `${baseDomain}-${timestamp}-${userId.slice(0, 6)}`;
  };

  const handleNicheSelect = async (nicheName: string) => {
    setSelectedNiche(nicheName);
    setStep('creating');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const uniqueDomainName = await generateUniqueDomainName(user.id, nicheName);

      // Créer ou mettre à jour les paramètres de la boutique
      const { data: storeData, error: storeError } = await supabase
        .from('store_settings')
        .upsert({
          user_id: user.id,
          store_name: `${nicheName} Store`,
          domain_name: uniqueDomainName,
          is_custom_domain: false,
        })
        .select()
        .single();

      if (storeError) throw storeError;

      // Générer la boutique avec l'IA
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

  const handleGoToDashboard = () => {
    navigate('/tableau-de-bord');
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

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Votre boutique sera créée sur un sous-domaine unique de sokoby.com
          </AlertDescription>
        </Alert>

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
            onGoToDashboard={handleGoToDashboard}
          />
        )}
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;