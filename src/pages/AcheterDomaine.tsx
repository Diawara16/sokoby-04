import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DomainChecker } from "@/components/store/DomainChecker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const AcheterDomaine = () => {
  const [domainName, setDomainName] = useState("");
  const { toast } = useToast();
  const [suggestedDomains, setSuggestedDomains] = useState<string[]>([]);

  const generateSuggestedDomains = (baseDomain: string) => {
    // Enlever l'extension du domaine s'il y en a une
    const baseName = baseDomain.split('.')[0];
    
    // Générer des suggestions avec différentes extensions
    return [
      `${baseName}.com`,
      `${baseName}.fr`,
      `${baseName}.net`,
      `${baseName}.io`,
      `${baseName}-shop.com`,
      `${baseName}-store.com`,
    ];
  };

  const handleDomainCheck = (domain: string) => {
    if (domain) {
      const suggestions = generateSuggestedDomains(domain);
      setSuggestedDomains(suggestions);
    } else {
      setSuggestedDomains([]);
    }
  };

  const handlePurchase = (domain: string) => {
    toast({
      title: "Redirection vers le paiement",
      description: `Vous allez être redirigé vers le processus d'achat pour ${domain}`,
    });
    // Ici, on pourrait rediriger vers un processus de paiement
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Acheter un nouveau domaine</h1>
      
      <Card className="p-6 mb-6">
        <DomainChecker 
          value={domainName} 
          onChange={(value) => {
            setDomainName(value);
            handleDomainCheck(value);
          }}
        />
      </Card>

      {suggestedDomains.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Autres domaines disponibles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestedDomains.map((domain) => (
              <div 
                key={domain} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <span className="font-medium">{domain}</span>
                <Button 
                  onClick={() => handlePurchase(domain)}
                  size="sm"
                >
                  Acheter
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AcheterDomaine;