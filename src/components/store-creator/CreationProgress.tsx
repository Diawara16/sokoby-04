import { Progress } from "@/components/ui/progress";

interface CreationProgressProps {
  progress: number;
  currentStep: string;
}

export const CreationProgress = ({ 
  progress, 
  currentStep
}: CreationProgressProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {currentStep === 'theme' ? 'Personnalisation du thème' : 'Création de votre boutique'}
          </h2>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg">Création de votre boutique en cours...</p>
          <p className="text-sm text-muted-foreground">
            Cette opération peut prendre quelques minutes
          </p>
        </div>
      </div>
    </div>
  );
};