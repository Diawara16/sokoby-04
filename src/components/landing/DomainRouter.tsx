import { useEffect, useState } from "react";
import { DynamicLanding } from "./DynamicLanding";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const DomainRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDomainValid, setIsDomainValid] = useState(false);
  const { toast } = useToast();
  const hostname = window.location.hostname;

  useEffect(() => {
    const checkDomain = async () => {
      try {
        console.log('DomainRouter - Vérification du domaine:', hostname);
        
        // Liste des domaines principaux pour double vérification
        const mainDomains = ['localhost', 'sokoby.com', 'www.sokoby.com', 'preview--sokoby-04.lovable.app'];
        
        if (mainDomains.includes(hostname)) {
          console.log('DomainRouter - Domaine principal détecté, validation automatique');
          setIsDomainValid(true);
          setIsLoading(false);
          return;
        }

        // Si ce n'est pas un domaine principal, vérifier dans la base de données
        console.log('DomainRouter - Vérification dans la base de données pour:', hostname);
        const { data: domainVerification, error } = await supabase
          .from('domain_verifications')
          .select('*')
          .eq('domain_name', hostname)
          .eq('verified', true)
          .maybeSingle();

        if (error) {
          console.error('DomainRouter - Erreur Supabase:', error);
          setIsDomainValid(false);
        } else {
          console.log('DomainRouter - Résultat de la vérification:', domainVerification);
          setIsDomainValid(!!domainVerification);
        }
      } catch (error) {
        console.error('DomainRouter - Erreur lors de la vérification du domaine:', error);
        setIsDomainValid(false);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier le domaine",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkDomain();
  }, [hostname, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isDomainValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Domaine non configuré</h1>
        <p className="text-gray-600 text-center">
          Ce domaine n'est pas configuré correctement. Veuillez vérifier votre configuration DNS.
        </p>
      </div>
    );
  }

  return <DynamicLanding />;
};