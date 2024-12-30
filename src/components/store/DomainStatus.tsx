import { Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface DomainStatusProps {
  isCheckingDomain: boolean;
  domainStatus: 'available' | 'taken' | null;
  onPurchase?: () => void;
}

export const DomainStatus = ({ isCheckingDomain, domainStatus, onPurchase }: DomainStatusProps) => {
  return (
    <div className="flex items-center justify-between mt-1">
      <p className="text-sm">
        {isCheckingDomain ? (
          <span className="text-gray-500">Vérification de la disponibilité...</span>
        ) : domainStatus === 'available' ? (
          <span className="text-success-600">Ce domaine est disponible !</span>
        ) : domainStatus === 'taken' ? (
          <span className="text-destructive">Ce domaine est déjà pris</span>
        ) : (
          <span className="text-gray-500">
            Entrez votre nom de domaine personnalisé ou utilisez notre sous-domaine gratuit
          </span>
        )}
      </p>
      {domainStatus === 'available' && onPurchase && (
        <Button 
          onClick={onPurchase}
          size="sm"
          className="ml-4"
          variant="destructive"
        >
          Acheter
        </Button>
      )}
    </div>
  );
};