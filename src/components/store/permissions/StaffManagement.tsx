import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffInviteForm } from "./StaffInviteForm";
import { StaffMemberList } from "./StaffMemberList";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { StaffMember } from "../types";
import { Button } from "@/components/ui/button";

export const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStaffMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Vous devez être connecté pour accéder à cette page");
        return;
      }

      console.log("Chargement des paramètres du magasin...");
      const { data: storeSettings, error: storeError } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (storeError) {
        console.error("Erreur lors de la vérification du magasin:", storeError);
        throw new Error("Impossible de récupérer les paramètres du magasin");
      }

      if (!storeSettings) {
        console.log("Aucun magasin trouvé, création des paramètres par défaut...");
        const { data: newStore, error: createError } = await supabase
          .from('store_settings')
          .insert({
            user_id: user.id,
            store_name: 'Ma boutique',
            store_email: user.email,
          })
          .select()
          .single();

        if (createError) {
          console.error('Erreur création store:', createError);
          throw new Error("Impossible de créer les paramètres du magasin");
        }

        setStoreId(newStore.id);
      } else {
        setStoreId(storeSettings.id);
      }

      // Récupérer les membres du staff
      const { data: members, error: membersError } = await supabase
        .from('staff_members')
        .select('*')
        .eq('store_id', storeSettings?.id || null);

      if (membersError) {
        console.error('Erreur staff_members:', membersError);
        throw new Error("Impossible de charger les membres de l'équipe");
      }

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