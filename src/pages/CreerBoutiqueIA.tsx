import { NicheSelector } from "@/components/store-creator/NicheSelector";
import { CreationProgress } from "@/components/store-creator/CreationProgress";
import { CreationComplete } from "@/components/store-creator/CreationComplete";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useStoreCreation } from "@/hooks/useStoreCreation";

const CreerBoutiqueIA = () => {
  const {
    step,
    isLoading,
    progress,
    error,
    storeUrl,
    handleNicheSelect,
    handleComplete,
  } = useStoreCreation();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Créer une boutique avec l'IA
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'niche' && (
        <NicheSelector onNicheSelect={handleNicheSelect} />
      )}

      {step === 'progress' && (
        <CreationProgress progress={progress} isLoading={isLoading} />
      )}

      {step === 'complete' && storeUrl && (
        <CreationComplete storeUrl={storeUrl} onComplete={handleComplete} />
      )}
    </div>
  );
};

export default CreerBoutiqueIA;