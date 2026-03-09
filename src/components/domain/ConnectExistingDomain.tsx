import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const ConnectExistingDomain = () => {
  const [domainName, setDomainName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"success" | "error" | null>(null);
  const { toast } = useToast();

  const verifyDns = async (domain: string): Promise<boolean> => {
    console.log("Vérification DNS pour:", domain);
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await response.json();
      console.log("Réponse DNS:", data);
      return data.Answer?.some(
        (record: any) => record.type === 1 && record.data === '185.158.133.1'
      ) ?? false;
    } catch (error) {
      console.error("Erreur DNS lookup:", error);
      return false;
    }
  };

  const handleDomainVerification = async () => {
    if (!domainName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de domaine",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);

    try {
      const hasCorrectDns = await verifyDns(domainName);

      if (hasCorrectDns) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error: storeError } = await supabase
          .from('store_settings')
          .update({ domain_name: domainName, is_custom_domain: true })
          .eq('user_id', user.id);

        if (storeError) throw storeError;

        const { error: verificationError } = await supabase
          .from('domain_verifications')
          .upsert({
            domain_name: domainName,
            user_id: user.id,
            verification_token: crypto.randomUUID(),
            verified: true,
            verified_at: new Date().toISOString()
          });

        if (verificationError) throw verificationError;

        setVerificationStatus("success");
        toast({ title: "Domaine connecté", description: "Votre domaine a été connecté avec succès." });
      } else {
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      setVerificationStatus("error");
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du domaine.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domain">Nom de domaine</Label>
          <Input
            id="domain"
            type="text"
            placeholder="exemple: mondomaine.com"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
        </div>

        <Button
          onClick={handleDomainVerification}
          disabled={isVerifying || !domainName.trim()}
          className="w-full"
        >
          {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isVerifying ? "Vérification..." : "Vérifier et connecter le domaine"}
        </Button>
      </div>

      {verificationStatus === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            Domaine connecté avec succès ! La propagation DNS peut prendre jusqu'à 48h.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "error" && (
        <div className="space-y-4">
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              La configuration DNS n'est pas encore correcte. Ajoutez les enregistrements ci-dessous chez votre registrar, puis revérifiez.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleDomainVerification}
            disabled={isVerifying}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Revérifier le DNS
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Instructions de configuration DNS</h3>
        <div className="space-y-2 text-sm">
          <p>Pour connecter votre domaine, ajoutez ces enregistrements DNS chez votre registrar :</p>
          <div className="space-y-3">
            <div className="bg-muted p-4 rounded-md">
              <p className="font-semibold mb-2">Enregistrement A (domaine principal)</p>
              <p><strong>Type :</strong> A</p>
              <p><strong>Nom :</strong> @</p>
              <p><strong>Valeur :</strong> 185.158.133.1</p>
              <p><strong>TTL :</strong> 3600</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-semibold mb-2">Enregistrement A (sous-domaine www)</p>
              <p><strong>Type :</strong> A</p>
              <p><strong>Nom :</strong> www</p>
              <p><strong>Valeur :</strong> 185.158.133.1</p>
              <p><strong>TTL :</strong> 3600</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
