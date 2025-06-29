
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

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            date_of_birth: dateOfBirth,
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
          description: "Un lien de vérification a été envoyé à votre adresse email. Veuillez cliquer sur le lien pour activer votre compte.",
        });
        navigate("/verify-email");
      } else if (data.user && data.user.email_confirmed_at) {
        // L'email est déjà vérifié
        console.log("Email already verified");
        toast({
          title: "Compte créé avec succès",
          description: "Bienvenue ! Votre compte a été créé et vérifié.",
        });
        navigate("/tableau-de-bord");
      }

      return data;
    } catch (err: any) {
      console.error("Error during sign up:", err);
      let errorMessage = "Une erreur est survenue lors de la création du compte";
      
      if (err.message.includes("already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée";
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
