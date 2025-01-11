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
        
        // Vérifier si c'est le domaine principal
        if (hostname === 'sokoby.com' || hostname === 'www.sokoby.com') {
          console.log('DomainRouter - Domaine principal détecté');
          setIsDomainValid(true);
          setIsLoading(false);
          return;
        }

        console.log('DomainRouter - Vérification dans la base de données pour:', hostname);
        // Vérifier si c'est un sous-domaine personnalisé
        const { data: domainVerification, error } = await supabase
          .from('domain_verifications')
          .select('*')
          .eq('domain_name', hostname)
          .eq('verified', true)
          .maybeSingle();

        if (error) {
          console.error('DomainRouter - Erreur Supabase:', error);
          throw error;
        }

        console.log('DomainRouter - Résultat de la vérification:', domainVerification);
        setIsDomainValid(!!domainVerification);
      } catch (error) {
        console.error('DomainRouter - Erreur lors de la vérification du domaine:', error);
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