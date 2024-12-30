import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ConnecterDomaine() {
  const [domainName, setDomainName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"none" | "success" | "error">("none");
  const { toast } = useToast();

  const handleDomainVerification = async () => {
    if (!domainName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de domaine",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus("none");

    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer cette action",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour les paramètres de la boutique avec le nouveau domaine
      const { error } = await supabase
        .from('store_settings')
        .update({ 
          domain_name: domainName,
          is_custom_domain: true 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setVerificationStatus("success");
      toast({
        title: "Succès",
        description: "Votre domaine a été connecté avec succès",
      });
    } catch (error: any) {
      console.error("Erreur lors de la connexion du domaine:", error);
      setVerificationStatus("error");
      toast({
        title: "Erreur",
        description: "Impossible de connecter le domaine",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Connecter votre domaine existant</h1>
      
      <Card className="p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <Label htmlFor="domain">Nom de domaine</Label>
            <div className="mt-2">
              <Input
                id="domain"
                type="text"
                placeholder="exemple.com"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Instructions de configuration DNS</h3>
            <div className="space-y-2 text-sm">
              <p>Pour connecter votre domaine, ajoutez les enregistrements DNS suivants :</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Type :</strong> A</p>
                <p><strong>Nom :</strong> @</p>
                <p><strong>Valeur :</strong> 76.76.21.21</p>
              </div>
            </div>
          </div>

          {verificationStatus === "success" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Domaine connecté avec succès</span>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Erreur lors de la connexion du domaine</span>
            </div>
          )}

          <Button 
            onClick={handleDomainVerification}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? "Vérification..." : "Connecter le domaine"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 mt-8 max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Besoin d'aide ?</h3>
        <p className="text-gray-600">
          Si vous rencontrez des difficultés pour connecter votre domaine, 
          consultez notre guide détaillé ou contactez notre support technique.
        </p>
        <Button variant="outline" className="mt-4">
          Consulter le guide
        </Button>
      </Card>
    </div>
  );
}