import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { StaffInviteForm } from "./StaffInviteForm";
import { StaffMemberList } from "./StaffMemberList";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const { toast } = useToast();

  const loadStaffMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: storeData } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!storeData) {
        throw new Error("Paramètres du magasin non trouvés");
      }

      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStaffMembers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres du personnel",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadStaffMembers();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestion des employés</CardTitle>
        <CardDescription>
          Invitez jusqu'à 5 employés ou développeurs pour vous aider à gérer votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StaffInviteForm 
          onInviteSent={loadStaffMembers}
          staffCount={staffMembers.length}
        />
        <div className="mt-8">
          <StaffMemberList 
            staffMembers={staffMembers}
            onMemberRemoved={loadStaffMembers}
          />
        </div>
      </CardContent>
    </Card>
  );
};