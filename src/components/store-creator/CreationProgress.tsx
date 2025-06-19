
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2, Wand2, Package, Store, Sparkles } from "lucide-react";
import { ErrorDisplay } from "./ErrorDisplay";

interface CreationProgressProps {
  progress: number;
  processStep: 'init' | 'products' | 'store' | 'finalizing';
  error?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
}

const stepIcons = {
  init: Wand2,
  products: Package,
  store: Store,
  finalizing: Sparkles,
};

const stepLabels = {
  init: "Initialisation de votre boutique",
  products: "Génération des produits par l'IA",
  store: "Configuration de la boutique",
  finalizing: "Finalisation et déploiement",
};

export const CreationProgress = ({ 
  progress, 
  processStep, 
  error, 
  onRetry, 
  onBack 
}: CreationProgressProps) => {
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} onBack={onBack} />;
  }

  const steps = Object.keys(stepLabels) as Array<keyof typeof stepLabels>;
  const currentStepIndex = steps.indexOf(processStep);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-bold">Création de votre boutique en cours...</h2>
        <p className="text-muted-foreground">
          Notre IA génère votre boutique personnalisée avec des produits optimisés
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{stepLabels[processStep]}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const StepIcon = stepIcons[step];
            const isComplete = index < currentStepIndex || progress === 100;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div
                key={step}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCurrent 
                    ? 'bg-primary/5 border border-primary/20' 
                    : isComplete 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isComplete 
                    ? 'bg-green-100 text-green-600' 
                    : isCurrent 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span className={`font-medium ${
                  isCurrent ? 'text-primary' : isComplete ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {stepLabels[step]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Création intelligente</p>
            <p className="text-blue-700">
              Votre boutique est générée automatiquement avec des produits optimisés pour votre niche.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
