import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { UseAuthForm } from "@/types/auth";

export const useAuthForm = (defaultIsSignUp: boolean = false): UseAuthForm => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { error: signInError } = await authService.signIn(email, password);

    if (!signInError) {
      toast({
        title: "Compte existant",
        description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
        variant: "destructive",
      });
      setIsSignUp(false);
      return false;
    }

    const { error } = await authService.signUp(email, password);

    if (error) {
      if (error.message.includes("User already registered")) {
        toast({
          title: "Email déjà utilisé",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        });
        setIsSignUp(false);
        return false;
      }
      throw error;
    }

    return true;
  };

  const handleSignIn = async () => {
    const { error } = await authService.signIn(email, password);
    if (error) throw error;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = isSignUp ? await handleSignUp() : await handleSignIn();

      if (success) {
        toast({
          title: isSignUp ? "Compte créé" : "Connexion réussie",
          description: isSignUp ? "Votre compte a été créé avec succès" : "Vous êtes maintenant connecté",
        });
        navigate(isSignUp ? "/onboarding" : "/profil");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isSignUp,
    setIsSignUp,
    handleSubmit,
  };
};