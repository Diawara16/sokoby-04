import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DomainStatusProps {
  domain: string;
  status: 'available' | 'taken' | null;
  isChecking: boolean;
  onPurchase: () => void;
}

export const DomainStatus = ({ domain, status, isChecking, onPurchase }: DomainStatusProps) => {
  if (!domain || (!isChecking && !status)) return null;

  if (isChecking) {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Vérification de la disponibilité de {domain}...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'available') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-500" />
        <AlertDescription className="flex justify-between items-center">
          <span className="text-green-700">
            {domain} est disponible !
          </span>
          <Button
            size="sm"
            onClick={onPurchase}
            className="bg-green-500 hover:bg-green-600"
          >
            Sélectionner ce domaine
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'taken') {
    return (
      <Alert className="bg-red-50 border-red-200">
        <X className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-700">
          Désolé, {domain} n'est pas disponible. Voici quelques suggestions alternatives ci-dessous.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};