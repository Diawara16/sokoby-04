import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffInviteForm } from "./StaffInviteForm";
import { StaffMemberList } from "./StaffMemberList";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface StaffMember {
  id: string;
  email: string;
  role: string;
  status: string;
}

export const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStaffMembers = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Récupérer d'abord les paramètres du magasin
      const { data: store, error: storeError } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (storeError) {
        console.error('Erreur store_settings:', storeError);
        throw new Error("Impossible de récupérer les paramètres du magasin");
      }

      if (!store) {
        throw new Error("Paramètres du magasin non trouvés");
      }

      setStoreId(store.id);

      // Récupérer les membres du staff
      const { data: members, error: membersError } = await supabase
        .from('staff_members')
        .select('*')
        .eq('store_id', store.id);

      if (membersError) {
        console.error('Erreur staff_members:', membersError);
        throw new Error("Impossible de charger les membres de l'équipe");
      }

      setStaffMembers(members || []);
    } catch (error: any) {
      console.error('Erreur globale:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const handleMemberRemoved = () => {
    loadStaffMembers();
  };

  const handleInviteSent = () => {
    loadStaffMembers();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!storeId) {
    return (
      <Alert>
        <AlertDescription>
          Impossible de charger les paramètres du magasin. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <StaffInviteForm 
        onInviteSent={handleInviteSent} 
        staffCount={staffMembers.length} 
      />
      <StaffMemberList 
        staffMembers={staffMembers} 
        onMemberRemoved={handleMemberRemoved} 
      />
    </div>
  );
};