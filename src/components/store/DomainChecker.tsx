import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DomainStatus } from "./DomainStatus";
import { useDomainCheck } from "@/hooks/useDomainCheck";

interface DomainCheckerProps {
  value: string;
  onChange: (value: string) => void;
  onPurchase: (domain: string) => void;
}

export const DomainChecker = ({ value, onChange, onPurchase }: DomainCheckerProps) => {
  const {
    isCheckingDomain,
    domainStatus,
    suggestedDomains,
    checkDomainAvailability
  } = useDomainCheck();

  const handleCheck = () => {
    checkDomainAvailability(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Entrez votre nom de domaine"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleCheck}
          disabled={isCheckingDomain || !value}
        >
          {isCheckingDomain ? "Vérification..." : "Vérifier"}
        </Button>
      </div>

      <DomainStatus 
        domain={value} 
        status={domainStatus} 
        isChecking={isCheckingDomain}
        onPurchase={() => onPurchase(value)}
      />

      {suggestedDomains.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Suggestions de domaines disponibles :</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestedDomains.map((domain) => (
              <Card 
                key={domain}
                className="p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <span className="font-medium">{domain}</span>
                <Button
                  size="sm"
                  onClick={() => onPurchase(domain)}
                  variant="outline"
                >
                  Sélectionner
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};