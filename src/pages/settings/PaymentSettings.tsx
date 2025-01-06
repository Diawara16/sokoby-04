import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Wallet } from "lucide-react";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";

const PaymentSettings = () => {
  const { isLoading, savePaymentSettings } = usePaymentSettings();

  const handleSave = async () => {
    await savePaymentSettings({
      stripeEnabled: true,
      apiKeys: {
        stripePublicKey: 'pk_test_...',
        stripeSecretKey: 'sk_test_...'
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Méthodes de paiement
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stripe</Label>
              <div className="text-sm text-muted-foreground">
                Acceptez les paiements par carte bancaire
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>PayPal</Label>
              <div className="text-sm text-muted-foreground">
                Acceptez les paiements via PayPal
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Clés API
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="stripe_public">Clé publique Stripe</Label>
            <Input
              id="stripe_public"
              type="text"
              placeholder="pk_test_..."
            />
          </div>

          <div>
            <Label htmlFor="stripe_secret">Clé secrète Stripe</Label>
            <Input
              id="stripe_secret"
              type="password"
              placeholder="sk_test_..."
            />
          </div>

          <div>
            <Label htmlFor="paypal_client">Client ID PayPal</Label>
            <Input
              id="paypal_client"
              type="text"
              placeholder="client_id_..."
            />
          </div>

          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSettings;