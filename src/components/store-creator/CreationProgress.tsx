import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CreationProgressProps {
  progress: number;
  isLoading: boolean;
}

export const CreationProgress = ({ progress, isLoading }: CreationProgressProps) => {
  const getMessage = (progress: number) => {
    if (progress < 30) return "Initialisation de votre boutique...";
    if (progress < 60) return "Génération des produits...";
    return "Finalisation de la configuration...";
  };

  return (
    <div className="text-center py-12">
      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2">
        Création de votre boutique en cours...
      </h2>
      <div className="max-w-md mx-auto">
        <Progress value={progress} className="mb-4" />
      </div>
      <p className="text-muted-foreground">
        {getMessage(progress)}
      </p>
    </div>
  );
};