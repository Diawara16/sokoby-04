import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { UseAuthForm } from "@/types/auth";

export const useAuthForm = (defaultIsSignUp: boolean = false): UseAuthForm => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { error: signUpError } = await authService.signUp(email, password);

    if (signUpError) {
      if (signUpError.message.includes("User already registered")) {
        setError("Un compte existe déjà avec cet email. Veuillez vous connecter.");
        setIsSignUp(false);
        return false;
      }
      throw signUpError;
    }

    return true;
  };

  const handleSignIn = async () => {
    const { error: signInError } = await authService.signIn(email, password);
    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Email ou mot de passe incorrect");
        return false;
      }
      throw signInError;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = isSignUp ? await handleSignUp() : await handleSignIn();

      if (success) {
        toast({
          title: isSignUp ? "Compte créé" : "Connexion réussie",
          description: isSignUp ? "Votre compte a été créé avec succès" : "Vous êtes maintenant connecté",
        });

        if (isSignUp) {
          navigate("/onboarding");
        } else {
          // Redirection vers la page d'accueil après la connexion
          navigate("/");
          // Recharger la page pour mettre à jour l'état de l'authentification
          window.location.reload();
        }
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
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
    error,
    handleSubmit,
  };
};