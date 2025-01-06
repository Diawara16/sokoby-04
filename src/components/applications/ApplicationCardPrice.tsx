import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApplicationCardPriceProps {
  price?: {
    monthly: number;
    annual?: number;
  };
}

export function ApplicationCardPrice({ price }: ApplicationCardPriceProps) {
  if (!price) return null;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">
          {formatPrice(price.monthly)}/mois
          {price.annual && (
            <span className="text-xs text-muted-foreground ml-2">
              ou {formatPrice(price.annual)}/an
            </span>
          )}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Disponible avec le plan Pro ({formatPrice(19)}/mois) ou Entreprise ({formatPrice(49)}/mois)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}