
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useProfileCreation = (hasProfile: boolean) => {
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const createProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        console.log("Vérification du profil pour l'utilisateur:", user.id);
        setIsCreatingProfile(true);

        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Erreur lors de la vérification du profil:", profileError);
          throw profileError;
        }

        console.log("Profil existant:", existingProfile);

        if (!existingProfile) {
          console.log("Création d'un nouveau profil...");
          
          // Calculer la date de fin d'essai (14 jours à partir d'aujourd'hui)
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + 14);

          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: user.id, 
              email: user.email,
              trial_ends_at: trialEndsAt.toISOString(),
            }]);

          if (insertError) {
            console.error("Erreur lors de l'insertion du profil:", insertError);
            throw insertError;
          }

          console.log("Profil créé avec succès avec période d'essai de 14 jours");
          toast({
            title: "Bienvenue !",
            description: "Votre compte a été créé avec succès. Vous disposez de 14 jours d'essai gratuit.",
          });
        }
      } catch (error: any) {
        console.error("Erreur lors de la création du profil:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de votre profil",
          variant: "destructive",
        });
      } finally {
        setIsCreatingProfile(false);
      }
    };

    if (!hasProfile) {
      createProfile();
    }
  }, [hasProfile, toast]);

  return { isCreatingProfile };
};
