import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Wallet } from "lucide-react";

const PaymentSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Paramètres de paiement mis à jour",
      description: "Vos paramètres de paiement ont été sauvegardés avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres de paiement</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Méthodes de paiement acceptées
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input type="checkbox" id="stripe" className="w-4 h-4" />
              <Label htmlFor="stripe">Stripe (Cartes bancaires)</Label>
            </div>
            
            <div className="flex items-center gap-4">
              <Input type="checkbox" id="paypal" className="w-4 h-4" />
              <Label htmlFor="paypal">PayPal</Label>
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
              <Label htmlFor="stripe_key">Clé secrète Stripe</Label>
              <Input
                id="stripe_key"
                type="password"
                placeholder="sk_test_..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="stripe_public">Clé publique Stripe</Label>
              <Input
                id="stripe_public"
                type="text"
                placeholder="pk_test_..."
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les modifications
        </Button>
      </div>
    </div>
  );
};

export default PaymentSettings;