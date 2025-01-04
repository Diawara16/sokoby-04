import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DomainAlertProps {
  domainName: string | null;
}

export const DomainAlert = ({ domainName }: DomainAlertProps) => {
  const { data: domainVerification, isLoading } = useQuery({
    queryKey: ['domain-verification', domainName],
    queryFn: async () => {
      if (!domainName) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('domain_verifications')
        .select('*')
        .eq('domain_name', domainName)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching domain verification:', error);
        return null;
      }

      return data;
    },
    enabled: !!domainName
  });

  if (isLoading) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Vérification du statut du domaine...
        </AlertDescription>
      </Alert>
    );
  }

  if (!domainName) {
    return (
      <Alert className="mb-6">
        <XCircle className="h-4 w-4 text-red-500" />
        <AlertDescription>
          Aucun domaine configuré pour votre boutique
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6">
      {domainVerification?.verified ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <AlertDescription>
        {domainVerification?.verified 
          ? `Le domaine ${domainName} est correctement déployé et vérifié`
          : `Le domaine ${domainName} n'est pas encore vérifié. Veuillez configurer les enregistrements DNS.`
        }
      </AlertDescription>
    </Alert>
  );
};