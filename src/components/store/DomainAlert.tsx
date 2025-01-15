import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DomainAlertProps {
  domainName?: string | null;
}

export const DomainAlert = ({ domainName }: DomainAlertProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const verifyDomain = async () => {
    if (!domainName) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord configurer un nom de domaine.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifying(true);
      console.log("Début de la vérification du domaine:", domainName);

      // Vérifier l'enregistrement A du domaine
      console.log("Envoi de la requête DNS pour:", domainName);
      const response = await fetch(`https://dns.google/resolve?name=${domainName}&type=A`);
      const data = await response.json();
      console.log("Réponse DNS complète:", data);
      
      const hasCorrectARecord = data.Answer?.some(
        (record: any) => record.type === 1 && record.data === '76.76.21.21'
      );

      console.log("Enregistrement A correct ?", hasCorrectARecord, "Valeur attendue: 76.76.21.21");

      if (hasCorrectARecord) {
        console.log("Enregistrement A validé, mise à jour dans Supabase");
        // Mettre à jour le statut dans la base de données
        const { data: verificationData, error: updateError } = await supabase
          .from('domain_verifications')
          .upsert({
            domain_name: domainName,
            verified: true,
            verified_at: new Date().toISOString()
          });

        if (updateError) {
          console.error("Erreur lors de la mise à jour dans Supabase:", updateError);
          throw updateError;
        }

        console.log("Mise à jour Supabase réussie:", verificationData);
        setIsVerified(true);
        toast({
          title: "Domaine vérifié",
          description: "Votre domaine a été vérifié avec succès. La propagation DNS peut prendre jusqu'à 48h.",
        });
      } else {
        console.log("Configuration DNS incorrecte détectée");
        toast({
          title: "Configuration DNS incorrecte",
          description: "Veuillez vérifier que l'enregistrement A pointe vers 76.76.21.21",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur détaillée lors de la vérification:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du domaine.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!domainName) {
    return (
      <Alert>
        <AlertTitle>Configuration du domaine</AlertTitle>
        <AlertDescription>
          Vous n'avez pas encore configuré de nom de domaine pour votre boutique.
          Rendez-vous dans les paramètres pour en ajouter un.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <AlertTitle>Configuration du domaine</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>
          Votre boutique utilise actuellement le domaine : <strong>{domainName}</strong>
        </p>
        {isVerified ? (
          <p className="text-green-600">✓ Domaine vérifié</p>
        ) : (
          <div className="space-y-2">
            <p>
              Pour activer votre domaine, configurez l'enregistrement A suivant chez votre registrar :
            </p>
            <div className="bg-muted p-4 rounded-md">
              <p><strong>Type:</strong> A</p>
              <p><strong>Nom:</strong> @</p>
              <p><strong>Valeur:</strong> 76.76.21.21</p>
              <p><strong>TTL:</strong> 3600</p>
            </div>
            <Button 
              onClick={verifyDomain} 
              disabled={isVerifying}
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Vérifier maintenant
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};