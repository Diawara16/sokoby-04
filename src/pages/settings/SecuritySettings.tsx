import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Shield, Key, Lock } from "lucide-react";

const SecuritySettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Paramètres de sécurité mis à jour",
      description: "Vos paramètres de sécurité ont été sauvegardés avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres de sécurité</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Key className="h-5 w-5" />
            Authentification
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-muted-foreground">
                  Ajoute une couche de sécurité supplémentaire à votre compte
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Mot de passe
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="current_password">Mot de passe actuel</Label>
              <Input
                id="current_password"
                type="password"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new_password">Nouveau mot de passe</Label>
              <Input
                id="new_password"
                type="password"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
              <Input
                id="confirm_password"
                type="password"
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sessions actives
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Chrome sur Windows</p>
                <p className="text-sm text-muted-foreground">Dernière activité: il y a 2 minutes</p>
              </div>
              <Button variant="outline" size="sm">
                Déconnecter
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Application mobile iOS</p>
                <p className="text-sm text-muted-foreground">Dernière activité: il y a 1 heure</p>
              </div>
              <Button variant="outline" size="sm">
                Déconnecter
              </Button>
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

export default SecuritySettings;