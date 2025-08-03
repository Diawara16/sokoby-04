
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Attempting to sign up user:", email);
      console.log("Using Supabase client for signup");

      // Inscription avec URL de redirection
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/tableau-de-bord`
        }
      });

      console.log("Supabase signup response:", { data, error: signUpError });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }

      console.log("Sign up successful:", data);

      // Message de succès
      if (data.user) {
        console.log("User created successfully");
        
        // Avec auto-confirm activé, l'utilisateur est automatiquement connecté
        if (data.user.email_confirmed_at || data.session) {
          toast({
            title: "Compte créé avec succès !",
            description: "Votre compte a été créé et vous êtes maintenant connecté.",
          });
          navigate('/tableau-de-bord');
        } else {
          toast({
            title: "Compte créé !",
            description: "Un email de vérification a été envoyé à votre adresse. Veuillez cliquer sur le lien pour activer votre compte.",
          });
        }
      }

      return data;
    } catch (err: any) {
      console.error("Error during sign up:", err);
      console.error("Full error object:", err);
      
      let errorMessage = "Une erreur est survenue lors de la création du compte";
      
      // Gestion d'erreurs plus spécifique
      if (err.message?.includes("User already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée. Essayez de vous connecter.";
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
