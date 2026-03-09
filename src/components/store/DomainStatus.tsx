import { Check, X, Loader2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DomainStatusProps {
  domain: string;
  status: 'available' | 'taken' | null;
  isChecking: boolean;
  onPurchase?: () => void;
}

export const DomainStatus = ({ domain, status, isChecking }: DomainStatusProps) => {
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
        <AlertDescription className="space-y-2">
          <span className="text-green-700 block">
            {domain} semble disponible !
          </span>
          <p className="text-sm text-muted-foreground">
            Achetez ce domaine chez un registrar (Namecheap, GoDaddy, Cloudflare), puis connectez-le sur la page <strong>Connecter un domaine</strong>.
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <a href="https://www.namecheap.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1">
              Namecheap <ExternalLink className="h-3 w-3" />
            </a>
            <a href="https://www.godaddy.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1">
              GoDaddy <ExternalLink className="h-3 w-3" />
            </a>
            <a href="https://www.cloudflare.com/products/registrar/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1">
              Cloudflare <ExternalLink className="h-3 w-3" />
            </a>
          </div>
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
