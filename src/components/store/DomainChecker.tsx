import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DomainCheckerProps {
  value: string;
  onChange: (value: string) => void;
  onPurchase?: (domain: string) => void;
}

export const DomainChecker = ({ value, onChange, onPurchase }: DomainCheckerProps) => {
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'available' | 'taken' | null>(null);
  const { toast } = useToast();

  const checkDomainAvailability = async (domain: string) => {
    if (!domain) {
      setDomainStatus(null);
      return;
    }

    setIsCheckingDomain(true);
    try {
      const { data: existingDomain, error } = await supabase
        .from("store_settings")
        .select("domain_name")
        .eq("domain_name", domain)
        .maybeSingle();

      if (error) throw error;

      if (existingDomain) {
        setDomainStatus('taken');
        return;
      }

      const response = await fetch(`https://dns.google/resolve?name=${domain}`);
      const data = await response.json();
      
      setDomainStatus(data.Answer ? 'taken' : 'available');
    } catch (error) {
      console.error("Error checking domain:", error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier la disponibilité du domaine",
        variant: "destructive",
      });
    } finally {
      setIsCheckingDomain(false);
    }
  };

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
          className={`pr-10 ${
            domainStatus === 'available' ? 'border-green-500' : 
            domainStatus === 'taken' ? 'border-red-500' : ''
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isCheckingDomain ? (
            <Skeleton className="h-4 w-4 rounded-full" />
          ) : domainStatus === 'available' ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : domainStatus === 'taken' ? (
            <X className="h-4 w-4 text-red-500" />
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm">
          {isCheckingDomain ? (
            <span className="text-gray-500">Vérification de la disponibilité...</span>
          ) : domainStatus === 'available' ? (
            <span className="text-green-600">Ce domaine est disponible !</span>
          ) : domainStatus === 'taken' ? (
            <span className="text-red-600">Ce domaine est déjà pris</span>
          ) : (
            <span className="text-gray-500">
              Entrez votre nom de domaine personnalisé ou utilisez notre sous-domaine gratuit
            </span>
          )}
        </p>
        {domainStatus === 'available' && onPurchase && (
          <Button 
            onClick={() => onPurchase(value)}
            size="sm"
            className="ml-4"
          >
            Acheter
          </Button>
        )}
      </div>
    </div>
  );
};