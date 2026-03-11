
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ApplicationCardPriceProps {
  price?: {
    monthly: number;
    annual?: number;
  };
}

export function ApplicationCardPrice({ price }: ApplicationCardPriceProps) {
  const { formatPrice } = useCurrency();

  if (!price) return null;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">
          {formatPrice(price.monthly)}/month
          {price.annual && (
            <span className="text-xs text-muted-foreground ml-2">
              or {formatPrice(price.annual)}/year
            </span>
          )}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Available with Pro plan ({formatPrice(19)}/month) or Enterprise plan ({formatPrice(49)}/month)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
