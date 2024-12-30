import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DomainChecker } from "@/components/store/DomainChecker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentButtons } from "@/components/pricing/PaymentButtons";

const AcheterDomaine = () => {
  const [domainName, setDomainName] = useState("");
  const { toast } = useToast();
  const [suggestedDomains, setSuggestedDomains] = useState<string[]>([]);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const generateSuggestedDomains = (baseDomain: string) => {
    const baseName = baseDomain.split('.')[0];
    return [
      `${baseName}.com`,
      `${baseName}.fr`,
      `${baseName}.net`,
      `${baseName}.io`,
      `${baseName}-shop.com`,
      `${baseName}-store.com`,
    ];
  };

  const handleDomainCheck = (domain: string) => {
    if (domain) {
      const suggestions = generateSuggestedDomains(domain);
      setSuggestedDomains(suggestions);
    } else {
      setSuggestedDomains([]);
    }
  };

  const handlePurchaseClick = (domain: string) => {
    setSelectedDomain(domain);
    setShowPaymentDialog(true);
  };

  const handleSubscribe = async (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string
  ) => {
    try {
      setIsProcessingPurchase(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour acheter un domaine",
          variant: "destructive",
        });
        return;
      }

      // Vérifier si le domaine n'est pas déjà pris
      const { data: existingDomain } = await supabase
        .from("store_settings")
        .select("domain_name")
        .eq("domain_name", selectedDomain)
        .maybeSingle();

      if (existingDomain) {
        toast({
          title: "Domaine non disponible",
          description: "Ce domaine a déjà été réservé",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour les paramètres de la boutique avec le nouveau domaine
      const { error: updateError } = await supabase
        .from("store_settings")
        .update({ 
          domain_name: selectedDomain,
          is_custom_domain: true 
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Succès !",
        description: "Le domaine a été réservé pour votre boutique",
      });

      setShowPaymentDialog(false);

    } catch (error) {
      console.error("Erreur lors de l'achat du domaine:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'achat du domaine",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Acheter un nouveau domaine</h1>
      
      <Card className="p-6 mb-6">
        <DomainChecker 
          value={domainName} 
          onChange={(value) => {
            setDomainName(value);
            handleDomainCheck(value);
          }}
          onPurchase={handlePurchaseClick}
        />
      </Card>

      {suggestedDomains.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Autres domaines disponibles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestedDomains.map((domain) => (
              <div 
                key={domain} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <span className="font-medium">{domain}</span>
                <Button 
                  onClick={() => handlePurchaseClick(domain)}
                  size="sm"
                  disabled={isProcessingPurchase}
                  variant="destructive"
                >
                  Acheter
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Acheter le domaine {selectedDomain}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <PaymentButtons
              planType="starter"
              onSubscribe={handleSubscribe}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcheterDomaine;