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

  const cleanDomainName = (domain: string) => {
    // Enlever le protocole et www si présent
    let cleaned = domain.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');
    
    // Enlever les espaces
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanedDomain = cleanDomainName(inputValue);
    onChange(cleanedDomain);
    
    const timeoutId = setTimeout(() => {
      if (cleanedDomain) {
        checkDomainAvailability(cleanedDomain);
      }
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