import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Mail } from "lucide-react";

const UserSettings = () => {
  const { toast } = useToast();

  const handleInvite = () => {
    toast({
      title: "Invitation envoyée",
      description: "L'utilisateur a été invité à rejoindre votre boutique.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Inviter un utilisateur
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="utilisateur@example.com"
                />
                <Button onClick={handleInvite}>
                  Inviter
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs actifs
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">admin@example.com</p>
                  <p className="text-sm text-muted-foreground">Administrateur</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Gérer
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">user@example.com</p>
                  <p className="text-sm text-muted-foreground">Éditeur</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Gérer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;