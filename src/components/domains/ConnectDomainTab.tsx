import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertTriangle, RefreshCw, Copy, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConnectDomainTabProps {
  onDomainAdded?: () => void;
}

export const ConnectDomainTab = ({ onDomainAdded }: ConnectDomainTabProps) => {
  const [domainName, setDomainName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainId, setDomainId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"success" | "error" | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: text });
  };

  const getStoreId = async (userId: string): Promise<string | null> => {
    const { data } = await supabase
      .from("stores")
      .select("id")
      .eq("owner_id", userId)
      .limit(1)
      .maybeSingle();
    return data?.id ?? null;
  };

  const handleSubmit = async () => {
    if (!domainName.trim()) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Erreur", description: "Vous devez être connecté.", variant: "destructive" });
        return;
      }

      const storeId = await getStoreId(user.id);

      const { data, error } = await supabase.from("domains").insert({
        domain_name: domainName.trim().toLowerCase(),
        user_id: user.id,
        store_id: storeId,
        domain_type: "external",
        status: "pending",
        ssl_status: "pending",
        is_primary: false,
      }).select("id").single();

      if (error) throw error;

      setDomainId(data.id);
      setSubmitted(true);
      setVerificationStatus(null);
      onDomainAdded?.();
      toast({ title: "Domaine ajouté", description: "Configurez maintenant vos enregistrements DNS." });
    } catch (error: any) {
      console.error("Insert error:", error);
      toast({ title: "Erreur", description: error.message || "Impossible d'ajouter le domaine.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!domainId) return;
    setIsVerifying(true);
    setVerificationStatus(null);

    try {
      // Set status to verifying
      await supabase.from("domains")
        .update({ status: "verifying", updated_at: new Date().toISOString() })
        .eq("id", domainId);

      const response = await fetch(`https://dns.google/resolve?name=${domainName}&type=A`);
      const data = await response.json();
      const pointsToSokoby = data.Answer?.some(
        (record: any) => record.type === 1 && record.data === "185.158.133.1"
      );

      const newStatus = pointsToSokoby ? "active" : "pending";
      await supabase.from("domains")
        .update({ status: newStatus, ssl_status: pointsToSokoby ? "active" : "pending", updated_at: new Date().toISOString() })
        .eq("id", domainId);

      if (pointsToSokoby) {
        setVerificationStatus("success");
        toast({ title: "Domaine vérifié", description: "Votre domaine pointe correctement vers Sokoby." });
      } else {
        setVerificationStatus("error");
      }
      onDomainAdded?.();
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      toast({ title: "Erreur", description: "Impossible de vérifier le domaine.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setVerificationStatus(null);
    setDomainName("");
    setDomainId(null);
  };

  return (
    <div className="space-y-6">
      {!submitted ? (
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="connect-domain">Nom de domaine</Label>
            <Input
              id="connect-domain"
              placeholder="ex: maboutique.com"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!domainName.trim() || isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Ajout en cours..." : "Configurer ce domaine"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Globe className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Configurez les enregistrements DNS ci-dessous chez votre registrar pour <strong>{domainName}</strong>, puis cliquez sur « Vérifier le domaine ».
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Enregistrement A</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-mono font-medium">A</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nom</span>
                    <span className="font-mono font-medium">@</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Valeur</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">185.158.133.1</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard("185.158.133.1")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">TTL</span>
                    <span className="font-mono font-medium">3600</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Enregistrement CNAME</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-mono font-medium">CNAME</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nom</span>
                    <span className="font-mono font-medium">www</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Valeur</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">connect.sokoby.com</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard("connect.sokoby.com")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">TTL</span>
                    <span className="font-mono font-medium">3600</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {verificationStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Domaine vérifié et connecté avec succès ! Le SSL sera provisionné automatiquement.
              </AlertDescription>
            </Alert>
          )}

          {verificationStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Le DNS ne pointe pas encore vers Sokoby. La propagation peut prendre jusqu'à 48h. Réessayez plus tard.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {isVerifying ? "Vérification..." : "Vérifier le domaine"}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Ajouter un autre domaine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
