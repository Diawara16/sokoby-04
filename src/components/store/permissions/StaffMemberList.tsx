import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { StaffMember } from "../types";

interface StaffMemberListProps {
  staffMembers: StaffMember[];
  onMemberRemoved: () => void;
}

export const StaffMemberList = ({ staffMembers, onMemberRemoved }: StaffMemberListProps) => {
  const { toast } = useToast();

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

      onMemberRemoved();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive",
      });
    }
  };

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

  if (staffMembers.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Aucun employé n'a encore été invité. Commencez par envoyer une invitation !
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {staffMembers.map((member) => (
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
      ))}
    </div>
  );
};