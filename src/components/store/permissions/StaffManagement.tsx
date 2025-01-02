import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { StaffInviteForm } from "./StaffInviteForm";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  email: string;
  role: string;
  status: string;
  invited_at: string;
  joined_at?: string;
  invited_email: string;
}

export const StaffManagement = () => {
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // D'abord, récupérer le store_id depuis store_settings
      const { data: storeSettings, error: storeError } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (storeError) {
        console.error('Erreur lors de la récupération des paramètres du magasin:', storeError);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les paramètres du magasin",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!storeSettings) {
        toast({
          title: "Erreur",
          description: "Paramètres du magasin non trouvés",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Ensuite, récupérer les membres du staff avec le store_id
      const { data: members, error: membersError } = await supabase
        .from('staff_members')
        .select('*')
        .eq('store_id', storeSettings.id);

      if (membersError) {
        console.error('Erreur lors du chargement des membres:', membersError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les membres de l'équipe",
          variant: "destructive",
        });
      } else {
        setStaffMembers(members || []);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des membres:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les membres de l'équipe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Gestion de l'équipe</h3>
      </div>

      <div className="space-y-8">
        <StaffInviteForm 
          onInviteSent={loadStaffMembers} 
          staffCount={staffMembers.length}
        />
      </div>
    </Card>
  );
};