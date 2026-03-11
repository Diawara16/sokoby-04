import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertTriangle, RefreshCw, Copy, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const ConnectDomainTab = () => {
  const [domainName, setDomainName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"success" | "error" | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: text });
  };

  const handleSubmit = () => {
    if (!domainName.trim()) return;
    setSubmitted(true);
    setVerificationStatus(null);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationStatus(null);

    try {
      const response = await fetch(`https://dns.google/resolve?name=${domainName}&type=A`);
      const data = await response.json();
      const pointsToSokoby = data.Answer?.some(
        (record: any) => record.type === 1 && record.data === "185.158.133.1"
      );

      if (pointsToSokoby) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Insert into domains table
        const { error } = await supabase.from("domains").insert({
          domain_name: domainName,
          user_id: user.id,
          domain_type: "custom",
          status: "active",
          ssl_status: "pending",
          is_primary: false,
        });

        if (error) throw error;

        setVerificationStatus("success");
        toast({ title: "Domaine connecté", description: "Votre domaine a été vérifié et ajouté avec succès." });
      } else {
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      toast({ title: "Erreur", description: "Impossible de vérifier le domaine.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
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
            />
          </div>
          <Button onClick={handleSubmit} disabled={!domainName.trim()} className="w-full">
            <Globe className="mr-2 h-4 w-4" />
            Configurer ce domaine
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Globe className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Configurez les enregistrements DNS ci-dessous chez votre registrar pour <strong>{domainName}</strong>, puis cliquez sur "Vérifier le domaine".
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
            <Button variant="outline" onClick={() => { setSubmitted(false); setVerificationStatus(null); }}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
