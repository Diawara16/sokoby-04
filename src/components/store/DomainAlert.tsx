import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DomainAlertProps {
  domainName: string | null;
}

export const DomainAlert = ({ domainName }: DomainAlertProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const verifyDomain = async () => {
    try {
      setIsVerifying(true);
      console.log("Vérification du domaine pour:", domainName);

      const { data: verificationData, error } = await supabase
        .from('domain_verifications')
        .select('*')
        .eq('domain_name', domainName)
        .maybeSingle();

      console.log("Résultat de la vérification:", verificationData);

      if (error) {
        throw error;
      }

      if (verificationData?.verified) {
        setIsVerified(true);
        toast({
          title: "Domaine vérifié",
          description: "Votre domaine a été vérifié avec succès.",
        });
      } else {
        toast({
          title: "Domaine non vérifié",
          description: "La vérification du domaine est en attente.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le domaine pour le moment.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (domainName) {
      verifyDomain();
    }
  }, [domainName]);

  if (!domainName) {
    return (
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertTitle>Domaine non configuré</AlertTitle>
        <AlertDescription>
          Vous n'avez pas encore configuré de domaine pour votre boutique.
          <Button variant="link" className="px-0 text-primary" asChild>
            <a href="/settings/domaine">Configurer maintenant</a>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <Globe className="h-4 w-4" />
      <AlertTitle>Domaine: {domainName}</AlertTitle>
      <AlertDescription className="flex items-center gap-2">
        {isVerifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Vérification en cours...
          </>
        ) : isVerified ? (
          "Votre domaine est vérifié et actif."
        ) : (
          <>
            En attente de vérification
            <Button 
              variant="outline" 
              size="sm"
              onClick={verifyDomain}
              disabled={isVerifying}
            >
              Vérifier maintenant
            </Button>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};