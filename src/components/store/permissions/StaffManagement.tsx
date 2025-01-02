import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Trash2, UserPlus, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StaffMember {
  id: string;
  invited_email: string;
  role: string;
  status: string;
  created_at: string;
}

export const StaffManagement = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Charger les membres du personnel
  const loadStaffMembers = async () => {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres du personnel",
        variant: "destructive",
      });
      return;
    }

    setStaffMembers(data || []);
  };

  // Envoyer une invitation
  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !role) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Vérifier le nombre maximum d'employés (4)
    if (staffMembers.length >= 4) {
      toast({
        title: "Erreur",
        description: "Vous avez atteint le nombre maximum d'employés (4)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('staff_members')
        .insert([
          {
            invited_email: email,
            role,
            invitation_token: crypto.randomUUID(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Invitation envoyée avec succès",
      });

      setEmail("");
      loadStaffMembers();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un membre
  const removeMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Membre supprimé avec succès",
      });

      loadStaffMembers();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive",
      });
    }
  };

  // Renvoyer une invitation
  const resendInvitation = async (email: string) => {
    try {
      // Ici, vous pouvez implémenter la logique pour renvoyer l'email d'invitation
      toast({
        title: "Succès",
        description: "Invitation renvoyée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestion des employés</CardTitle>
        <CardDescription>
          Invitez jusqu'à 4 employés ou développeurs pour vous aider à gérer votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={sendInvitation} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Email de l'employé"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Développeur</SelectItem>
                <SelectItem value="employee">Employé</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading}>
              <UserPlus className="mr-2 h-4 w-4" />
              Inviter
            </Button>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          {staffMembers.length === 0 ? (
            <Alert>
              <AlertDescription>
                Aucun employé n'a encore été invité. Commencez par envoyer une invitation !
              </AlertDescription>
            </Alert>
          ) : (
            staffMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{member.invited_email}</p>
                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resendInvitation(member.invited_email)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Renvoyer
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};