import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DomainAlertProps {
  domainName: string | null;
}

export const DomainAlert = ({ domainName }: DomainAlertProps) => {
  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {domainName ? 
          `Votre boutique utilise le domaine : ${domainName}` :
          "Aucun domaine configuré pour votre boutique"
        }
      </AlertDescription>
    </Alert>
  );
};