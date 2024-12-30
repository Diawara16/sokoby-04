import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CreationProgressProps {
  progress: number;
  isLoading?: boolean;
}

export const CreationProgress = ({ progress, isLoading = true }: CreationProgressProps) => {
  const getMessage = (progress: number) => {
    if (progress < 30) return "Initialisation de votre boutique...";
    if (progress < 60) return "Génération des produits...";
    return "Finalisation de la configuration...";
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 animate-pulse" />
        </div>
        <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        Création de votre boutique en cours
      </h2>
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <p className="text-gray-600">
          {getMessage(progress)}
        </p>
      </div>
    </div>
  );
};