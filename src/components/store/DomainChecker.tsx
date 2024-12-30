import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { DomainStatus } from "./DomainStatus";
import { useDomainCheck } from "@/hooks/useDomainCheck";

interface DomainCheckerProps {
  value: string;
  onChange: (value: string) => void;
  onPurchase?: (domain: string) => void;
}

export const DomainChecker = ({ value, onChange, onPurchase }: DomainCheckerProps) => {
  const { isCheckingDomain, domainStatus, checkDomainAvailability } = useDomainCheck();

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDomain = e.target.value;
    onChange(newDomain);
    
    const timeoutId = setTimeout(() => {
      checkDomainAvailability(newDomain);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div>
      <Label htmlFor="domain_name" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Nom de domaine
      </Label>
      <div className="relative">
        <Input
          id="domain_name"
          value={value}
          onChange={handleDomainChange}
          placeholder="maboutique.com"
          className="pr-10"
        />
      </div>
      <DomainStatus 
        isCheckingDomain={isCheckingDomain}
        domainStatus={domainStatus}
        onPurchase={onPurchase ? () => onPurchase(value) : undefined}
      />
    </div>
  );
};