import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Share2, Copy, Check } from "lucide-react";

export function ReferralCard() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateReferralCode = async () => {
    setIsLoading(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour générer un code de parrainage",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('referrals')
        .insert([
          { 
            referrer_id: user.id,
            code: code,
          }
        ]);

      if (error) throw error;

      setReferralCode(code);
      toast({
        title: "Code généré",
        description: "Votre code de parrainage a été généré avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du code:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(
        `Rejoignez-moi sur notre plateforme ! Utilisez mon code de parrainage : ${referralCode}`
      );
      setCopied(true);
      toast({
        title: "Copié !",
        description: "Le code a été copié dans le presse-papier",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Programme de parrainage</CardTitle>
        <CardDescription>
          Parrainez vos amis et gagnez des récompenses !
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!referralCode ? (
          <Button
            onClick={generateReferralCode}
            disabled={isLoading}
            className="w-full"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Générer un code de parrainage
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={generateReferralCode}
            >
              Générer un nouveau code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}