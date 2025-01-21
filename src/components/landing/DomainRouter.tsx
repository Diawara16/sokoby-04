import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DynamicLanding } from "./DynamicLanding";

export const DomainRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDomainValid, setIsDomainValid] = useState(false);
  const { toast } = useToast();
  const hostname = window.location.hostname;

  useEffect(() => {
    const checkDomain = async () => {
      try {
        console.log('DomainRouter - Vérification du domaine de boutique:', hostname);
        
        // Vérifier si le domaine existe dans store_settings
        const { data: storeSettings } = await supabase
          .from('store_settings')
          .select('*')
          .eq('domain_name', hostname)
          .maybeSingle();

        if (storeSettings) {
          console.log('DomainRouter - Domaine trouvé dans store_settings:', storeSettings);
          setIsDomainValid(true);
          setIsLoading(false);
          return;
        }

        // Sinon, vérifier dans domain_verifications
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

    if (hostname) {
      checkDomain();
    }
  }, [hostname, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!isDomainValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Domaine non configuré</h1>
        <p className="text-gray-600 text-center mb-8">
          Ce domaine n'est pas configuré correctement. Veuillez vérifier votre configuration DNS.
        </p>
        <Button 
          variant="default" 
          onClick={() => window.location.href = "https://sokoby.com"}
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return <DynamicLanding />;
};