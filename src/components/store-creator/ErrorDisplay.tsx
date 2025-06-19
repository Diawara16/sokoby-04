
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  onBack?: () => void;
}

export const ErrorDisplay = ({ error, onRetry, onBack }: ErrorDisplayProps) => {
  if (!error) return null;

  const getErrorDetails = (errorMessage: string) => {
    if (errorMessage.includes('OpenAI') || errorMessage.includes('quota')) {
      return {
        title: "Service IA temporairement indisponible",
        description: "Notre service de génération automatique est momentanément indisponible. Vous pouvez réessayer ou nous utiliserons des produits de démonstration.",
        type: "warning" as const
      };
    }
    
    if (errorMessage.includes('authentification') || errorMessage.includes('connecté')) {
      return {
        title: "Problème d'authentification",
        description: "Veuillez vous reconnecter pour créer votre boutique.",
        type: "error" as const
      };
    }
    
    if (errorMessage.includes('base de données') || errorMessage.includes('database')) {
      return {
        title: "Erreur de base de données",
        description: "Un problème technique est survenu. Veuillez réessayer dans quelques instants.",
        type: "error" as const
      };
    }
    
    return {
      title: "Erreur inattendue",
      description: errorMessage,
      type: "error" as const
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Alert className={`${errorDetails.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
        <AlertTriangle className={`h-4 w-4 ${errorDetails.type === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
        <AlertDescription className="space-y-3">
          <div>
            <h4 className={`font-medium ${errorDetails.type === 'warning' ? 'text-yellow-800' : 'text-red-800'}`}>
              {errorDetails.title}
            </h4>
            <p className={`text-sm mt-1 ${errorDetails.type === 'warning' ? 'text-yellow-700' : 'text-red-700'}`}>
              {errorDetails.description}
            </p>
          </div>
          
          <div className="flex gap-2 pt-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                variant={errorDetails.type === 'warning' ? 'outline' : 'default'}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </Button>
            )}
            
            {onBack && (
              <Button
                onClick={onBack}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
      
      {errorDetails.type === 'warning' && (
        <div className="text-center text-sm text-muted-foreground">
          <p>💡 Mode démonstration disponible avec des produits d'exemple</p>
        </div>
      )}
    </div>
  );
};
