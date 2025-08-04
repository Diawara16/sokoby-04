
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string, dateOfBirth: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Attempting to sign up user:", email);

      // Calculer la date de fin d'essai (14 jours à partir d'aujourd'hui)
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            date_of_birth: dateOfBirth,
            trial_ends_at: trialEndsAt.toISOString(),
          },
          emailRedirectTo: `${window.location.origin}/tableau-de-bord`,
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }

      console.log("Sign up successful:", data);

      if (data.user && !data.user.email_confirmed_at) {
        // L'utilisateur doit vérifier son email
        console.log("User needs to verify email");
        toast({
          title: "Vérifiez votre email",
          description: "Un lien de vérification a été envoyé à votre adresse email. Veuillez cliquer sur le lien pour activer votre compte et commencer votre essai gratuit de 14 jours.",
        });
      } else if (data.user && data.user.email_confirmed_at) {
        // L'email est déjà vérifié, créer le profil avec la période d'essai
        console.log("Email already verified, creating profile");
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            trial_ends_at: trialEndsAt.toISOString(),
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }

        toast({
          title: "Compte créé avec succès",
          description: "Bienvenue ! Votre essai gratuit de 14 jours commence maintenant.",
        });
        navigate("/tableau-de-bord");
      }

      return data;
    } catch (err: any) {
      console.error("Error during sign up:", err);
      let errorMessage = "Une erreur est survenue lors de la création du compte";
      
      if (err.message.includes("already registered") || err.message.includes("User already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée. Veuillez vous connecter à la place.";
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          navigate("/connexion");
        }, 3000);
      } else if (err.message.includes("password")) {
        errorMessage = "Le mot de passe doit contenir au moins 8 caractères";
      } else if (err.message.includes("email")) {
        errorMessage = "Veuillez entrer une adresse email valide";
      }
      
      setError(errorMessage);
      toast({
        title: "Erreur lors de l'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleSignUp };
};
