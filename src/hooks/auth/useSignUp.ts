import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { linkAuthenticatedUserToStore } from "@/services/linkAuthenticatedUserToStore";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const normalizedEmail = email.trim().toLowerCase();

      console.log("Attempting to sign up user:", normalizedEmail);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/tableau-de-bord`,
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }

      if (data.user) {
        console.log("Sign up successful:", data.user.id);

        // Best-effort linking for pre-existing store/invite rows
        try {
          await linkAuthenticatedUserToStore(data.user.id, data.user.email ?? normalizedEmail);
        } catch (linkError) {
          console.warn("[useSignUp] Store linking warning:", linkError);
        }

        if (data.user.email_confirmed_at || data.session) {
          toast({
            title: "Compte créé avec succès !",
            description: "Votre compte a été créé et vous êtes maintenant connecté.",
          });
          navigate("/tableau-de-bord");
        } else {
          toast({
            title: "Compte créé !",
            description:
              "Un email de vérification a été envoyé à votre adresse. Veuillez cliquer sur le lien pour activer votre compte.",
          });
        }
      }

      return data;
    } catch (err: any) {
      console.error("Error during sign up:", err);

      let errorMessage = "Une erreur est survenue lors de la création du compte";

      if (err.message?.includes("User already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée.";
        setError(errorMessage);
        toast({
          title: "Compte existant",
          description: "Cette adresse email est déjà associée à un compte. Redirection vers la connexion...",
          variant: "default",
        });
        setTimeout(() => {
          navigate("/connexion");
        }, 2000);
        return null;
      } else if (err.message?.includes("Password should be at least")) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
      } else if (err.message?.includes("Unable to validate email address")) {
        errorMessage = "Adresse email invalide";
      } else if (err.message?.includes("Email rate limit exceeded")) {
        errorMessage = "Trop de tentatives. Veuillez réessayer dans quelques minutes.";
      } else if (err.message) {
        errorMessage = `Erreur: ${err.message}`;
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

