import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useDomainCheck = () => {
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'available' | 'taken' | null>(null);
  const [suggestedDomains, setSuggestedDomains] = useState<string[]>([]);
  const { toast } = useToast();

  const generateSuggestedDomains = (baseDomain: string) => {
    const cleanBaseName = baseDomain
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .split('.')[0];

    return [
      `${cleanBaseName}.sokoby.com`,
      `${cleanBaseName}-shop.sokoby.com`,
      `${cleanBaseName}-store.sokoby.com`,
      `${cleanBaseName}-boutique.sokoby.com`,
      `${cleanBaseName}-market.sokoby.com`,
      `my-${cleanBaseName}.sokoby.com`,
      `the-${cleanBaseName}.sokoby.com`,
      `${cleanBaseName}-online.sokoby.com`,
    ];
  };

  const checkDomainAvailability = async (domain: string) => {
    if (!domain) {
      setDomainStatus(null);
      setSuggestedDomains([]);
      return;
    }

    setIsCheckingDomain(true);
    try {
      // Vérifier si le domaine existe déjà dans notre base de données
      const { data: existingDomain, error } = await supabase
        .from("store_settings")
        .select("domain_name")
        .eq("domain_name", domain)
        .maybeSingle();

      if (error) throw error;

      if (existingDomain) {
        setDomainStatus('taken');
        const suggestions = generateSuggestedDomains(domain);
        setSuggestedDomains(suggestions);
        return;
      }

      // Vérifier si le domaine est déjà utilisé sur Internet
      const response = await fetch(`https://dns.google/resolve?name=${domain}`);
      const data = await response.json();
      
      if (data.Answer) {
        setDomainStatus('taken');
        const suggestions = generateSuggestedDomains(domain);
        setSuggestedDomains(suggestions);
      } else {
        setDomainStatus('available');
        setSuggestedDomains([]);
      }
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
    suggestedDomains,
    checkDomainAvailability
  };
};