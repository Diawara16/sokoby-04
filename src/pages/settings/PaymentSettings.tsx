import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Wallet } from "lucide-react";

const PaymentSettings = () => {
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Paramètres de paiement mis à jour",
      description: "Les modifications ont été sauvegardées avec succès",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Moyens de paiement</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-8 w-8 text-gray-500" />
              <div className="space-y-0.5">
                <Label>Stripe</Label>
                <p className="text-sm text-muted-foreground">
                  Accepter les paiements par carte bancaire
                </p>
              </div>
            </div>
            <Switch
              checked={stripeEnabled}
              onCheckedChange={setStripeEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Wallet className="h-8 w-8 text-gray-500" />
              <div className="space-y-0.5">
                <Label>PayPal</Label>
                <p className="text-sm text-muted-foreground">
                  Accepter les paiements via PayPal
                </p>
              </div>
            </div>
            <Switch
              checked={paypalEnabled}
              onCheckedChange={setPaypalEnabled}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Sauvegarder les modifications
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSettings;