import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface StaffInviteFormProps {
  onInviteSent: () => void;
  staffCount: number;
}

export const StaffInviteForm = ({ onInviteSent, staffCount }: StaffInviteFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

    if (staffCount >= 5) {
      toast({
        title: "Erreur",
        description: "Vous avez atteint le nombre maximum d'employés (5)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Récupérer d'abord les paramètres du magasin
      const { data: storeData } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!storeData) {
        throw new Error("Paramètres du magasin non trouvés");
      }

      const { error } = await supabase
        .from('staff_members')
        .insert([
          {
            user_id: user.id,
            store_id: storeData.id,
            email,
            role,
            status: 'pending',
            permissions: {}
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Invitation envoyée avec succès",
      });

      setEmail("");
      onInviteSent();
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};