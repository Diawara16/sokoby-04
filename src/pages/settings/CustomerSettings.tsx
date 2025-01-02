import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CustomerSettings = () => {
  const [showLoginOptions, setShowLoginOptions] = useState(true);
  const [loginMethod, setLoginMethod] = useState("modern");
  const [allowMultipleAddresses, setAllowMultipleAddresses] = useState(true);
  const [allowStoreCredit, setAllowStoreCredit] = useState(true);
  const [customUrl, setCustomUrl] = useState("https://monsite.com/compte");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Paramètres mis à jour",
      description: "Les modifications ont été sauvegardées avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Comptes clients</h1>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Options de connexion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Liens de connexion</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les liens de connexion dans l'en-tête de la boutique et sur la page de paiement
                </p>
              </div>
              <Switch
                checked={showLoginOptions}
                onCheckedChange={setShowLoginOptions}
              />
            </div>

            <div className="space-y-4 border rounded-lg p-4">
              <Label>Choisissez la version des comptes clients à utiliser</Label>
              <RadioGroup value={loginMethod} onValueChange={setLoginMethod}>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="modern" id="modern" />
                  <div className="space-y-1">
                    <Label htmlFor="modern" className="font-medium">Comptes clients (Recommandé)</Label>
                    <p className="text-sm text-muted-foreground">
                      Les clients se connectent avec un code à usage unique envoyé à leur e-mail (pas de mot de passe)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="classic" id="classic" />
                  <div className="space-y-1">
                    <Label htmlFor="classic" className="font-medium">Ancienne version</Label>
                    <p className="text-sm text-muted-foreground">
                      Les clients créent un compte et se connectent avec e-mail et mot de passe
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Configurations supplémentaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurations</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Adresses multiples</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre aux clients d'enregistrer plusieurs adresses
                </p>
              </div>
              <Switch
                checked={allowMultipleAddresses}
                onCheckedChange={setAllowMultipleAddresses}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Crédit en magasin</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre aux clients de voir et utiliser leur crédit en magasin
                </p>
              </div>
              <Switch
                checked={allowStoreCredit}
                onCheckedChange={setAllowStoreCredit}
              />
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <p className="text-sm text-muted-foreground">
                Utilisez cette URL pour diriger vos clients vers leurs comptes
              </p>
              <div className="flex gap-2">
                <Input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">Gérer</Button>
              </div>
            </div>
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