import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { translations } from "@/translations";

export const useAuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Vérifions d'abord si l'utilisateur existe
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Si pas d'erreur, l'utilisateur existe déjà
    if (!signInError) {
      toast({
        title: "Compte existant",
        description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
        variant: "destructive",
      });
      setIsSignUp(false);
      return false;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          plan: "gratuit",
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    });

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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
        navigate(isSignUp ? "/onboarding" : "/");
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