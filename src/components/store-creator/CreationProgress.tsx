import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CreationProgressProps {
  progress: number;
  currentStep: string;
  isLoading?: boolean;
}

export const CreationProgress = ({ progress, currentStep, isLoading = true }: CreationProgressProps) => {
  const getStepDetails = () => {
    switch (currentStep) {
      case 'init':
        return {
          title: "Initialisation de votre boutique",
          description: "Configuration des paramètres de base..."
        };
      case 'products':
        return {
          title: "Génération des produits",
          description: "Création de produits pertinents pour votre niche..."
        };
      case 'store':
        return {
          title: "Configuration de la boutique",
          description: "Mise en place de votre boutique en ligne..."
        };
      case 'finalizing':
        return {
          title: "Finalisation",
          description: "Derniers ajustements..."
        };
      default:
        return {
          title: "Création en cours",
          description: "Veuillez patienter..."
        };
    }
  };

  const stepDetails = getStepDetails();

  return (
    <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 animate-pulse" />
        </div>
        <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        {stepDetails.title}
      </h2>
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="space-y-2">
          <p className="text-gray-600">
            {stepDetails.description}
          </p>
          <p className="text-sm text-gray-500">
            {progress}% complété
          </p>
        </div>
      </div>
    </div>
  );
};