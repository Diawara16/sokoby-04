import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CustomerSettings = () => {
  const [allowCustomerAccounts, setAllowCustomerAccounts] = useState(true);
  const [multipleAddresses, setMultipleAddresses] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Paramètres clients mis à jour",
      description: "Les modifications ont été sauvegardées avec succès",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres des comptes clients</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comptes clients</Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux clients de créer un compte
              </p>
            </div>
            <Switch
              checked={allowCustomerAccounts}
              onCheckedChange={setAllowCustomerAccounts}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Adresses multiples</Label>
              <p className="text-sm text-muted-foreground">
                Autoriser plusieurs adresses de livraison par client
              </p>
            </div>
            <Switch
              checked={multipleAddresses}
              onCheckedChange={setMultipleAddresses}
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

export default CustomerSettings;