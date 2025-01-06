import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DomainAlertProps {
  domainName: string | null;
}

export const DomainAlert = ({ domainName }: DomainAlertProps) => {
  const { toast } = useToast();

  const { data: domainVerification, isLoading, refetch } = useQuery({
    queryKey: ['domain-verification', domainName],
    queryFn: async () => {
      try {
        if (!domainName) return null;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        console.log("Vérification du domaine pour:", domainName);

        const { data, error } = await supabase
          .from('domain_verifications')
          .select('*')
          .eq('domain_name', domainName)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors de la vérification du domaine:', error);
          toast({
            title: "Erreur",
            description: "Impossible de vérifier le domaine",
            variant: "destructive",
          });
          return null;
        }

        console.log("Résultat de la vérification:", data);
        return data;
      } catch (error) {
        console.error('Erreur inattendue:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!domainName,
    refetchInterval: 30000
  });

  const handleVerifyDomain = async () => {
    try {
      console.log("Début de la vérification du domaine:", domainName);
      
      const { error } = await supabase.functions.invoke('verify-domain', {
        body: { domain: domainName }
      });
      
      if (error) {
        console.error('Erreur lors de la vérification:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier le domaine",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Succès",
        description: "Vérification du domaine lancée",
      });
      
      refetch();
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification",
        variant: "destructive",
      });
    }
  };

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
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            Le domaine {domainName} est correctement déployé et vérifié.
          </AlertDescription>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <p className="mb-4">Pour configurer {domainName}, suivez ces étapes :</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-semibold mb-2">1. Configuration du domaine principal</h4>
                <p><strong>Type :</strong> A</p>
                <p><strong>Nom :</strong> @</p>
                <p><strong>Valeur :</strong> 76.76.21.21</p>
                <p><strong>TTL :</strong> Automatique</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-semibold mb-2">2. Configuration du sous-domaine www</h4>
                <p><strong>Type :</strong> CNAME</p>
                <p><strong>Nom :</strong> www</p>
                <p><strong>Valeur :</strong> cname.vercel-dns.com</p>
                <p><strong>TTL :</strong> Automatique</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-semibold mb-2">3. Vérification SSL</h4>
                <p>Assurez-vous que votre domaine est accessible en HTTPS.</p>
                <p>Testez votre domaine : <a href={`https://${domainName}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://{domainName}</a></p>
              </div>

              <div className="mt-4">
                <Button onClick={handleVerifyDomain} variant="outline">
                  Vérifier maintenant
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>Notes importantes :</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>La propagation DNS peut prendre jusqu'à 48 heures</li>
                  <li>Le certificat SSL doit être actif pour que Facebook accepte le domaine</li>
                  <li>Le site doit être accessible via HTTPS</li>
                  <li>Nous vérifions automatiquement l'état de la configuration toutes les 30 secondes</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};