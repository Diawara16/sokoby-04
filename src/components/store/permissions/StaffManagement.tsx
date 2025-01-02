import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffInviteForm } from "./StaffInviteForm";
import { StaffMemberList } from "./StaffMemberList";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { StaffMember } from "../types";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "../hooks/useStoreSettings";

export const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { settings, isLoading: isLoadingStore } = useStoreSettings();

  const loadStaffMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Vous devez être connecté pour accéder à cette page");
        return;
      }

      if (!settings?.id) {
        console.log("Pas de magasin trouvé");
        return;
      }

      console.log("Chargement des membres du staff pour le magasin:", settings.id);
      const { data: members, error: membersError } = await supabase
        .from('staff_members')
        .select('*')
        .eq('store_id', settings.id);

      if (membersError) {
        console.error('Erreur staff_members:', membersError);
        throw new Error("Impossible de charger les membres de l'équipe");
      }

      console.log("Membres chargés:", members);
      setStaffMembers(members || []);
    } catch (error: any) {
      console.error('Erreur globale:', error);
      setError(error.message || "Une erreur est survenue");
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
    if (settings?.id) {
      loadStaffMembers();
    }
  }, [settings?.id]);

  const handleMemberRemoved = () => {
    loadStaffMembers();
  };

  const handleInviteSent = () => {
    loadStaffMembers();
  };

  if (isLoadingStore || isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings?.id) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Impossible de récupérer les paramètres du magasin. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription className="flex flex-col gap-4">
          <p>{error}</p>
          <Button onClick={loadStaffMembers} variant="outline" size="sm">
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <StaffInviteForm 
        onInviteSent={handleInviteSent} 
        staffCount={staffMembers.length}
        storeId={settings.id}
      />
      <StaffMemberList 
        staffMembers={staffMembers} 
        onMemberRemoved={handleMemberRemoved} 
      />
    </div>
  );
};