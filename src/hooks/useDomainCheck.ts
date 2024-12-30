import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useDomainCheck = () => {
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

  return {
    isCheckingDomain,
    domainStatus,
    checkDomainAvailability
  };
};