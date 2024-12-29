import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Users, Shield, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const UserPermissions = () => {
  const [collaboratorCode, setCollaboratorCode] = useState("");
  const [invitePolicy, setInvitePolicy] = useState("restricted");
  const [posAccess, setPosAccess] = useState(false);
  const { toast } = useToast();

  const generateNewCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCollaboratorCode(newCode);
    toast({
      title: "Nouveau code généré",
      description: "Le code de collaboration a été mis à jour",
    });
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Utilisateurs et autorisations</h3>
      </div>

      <div className="space-y-8">
        {/* Propriétaire de la boutique */}
        <div>
          <h4 className="text-lg font-medium mb-4">Propriétaire de la boutique</h4>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Store className="h-8 w-8 text-gray-500" />
            <div>
              <p className="font-medium">Boutique principale</p>
              <p className="text-sm text-gray-600">Accès complet aux paramètres et configurations</p>
            </div>
          </div>
        </div>

        {/* Paramètres du personnel */}
        <div>
          <h4 className="text-lg font-medium mb-4">Paramètres du personnel</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Accès au point de vente</Label>
                <p className="text-sm text-gray-600">Autoriser l'accès à l'application POS</p>
              </div>
              <Switch 
                checked={posAccess}
                onCheckedChange={setPosAccess}
              />
            </div>
          </div>
        </div>

        {/* Politique de collaboration */}
        <div>
          <h4 className="text-lg font-medium mb-4">Politique de collaboration</h4>
          <RadioGroup value={invitePolicy} onValueChange={setInvitePolicy}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="open" id="open" />
              <Label htmlFor="open">Tout le monde peut envoyer une requête de collaborateur</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="restricted" id="restricted" />
              <Label htmlFor="restricted">
                Seules les personnes avec un code de requête peuvent envoyer une demande
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Code de collaboration */}
        <div>
          <h4 className="text-lg font-medium mb-4">Code de requête de collaborateur</h4>
          <div className="flex gap-4">
            <Input
              value={collaboratorCode}
              onChange={(e) => setCollaboratorCode(e.target.value)}
              placeholder="Code de collaboration"
              className="max-w-xs"
            />
            <Button onClick={generateNewCode} variant="outline">
              Générer un nouveau code
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Partagez ce code pour permettre à quelqu'un de vous envoyer une requête de collaborateur.
          </p>
        </div>

        {/* Services connectés */}
        <div>
          <h4 className="text-lg font-medium mb-4">Services de connexion</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Applications externes</p>
                <p className="text-sm text-gray-600">
                  Autoriser les employés à utiliser les services externes
                </p>
              </div>
              <Button variant="outline">Configurer</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};