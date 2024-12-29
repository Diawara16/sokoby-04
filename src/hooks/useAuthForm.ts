import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

export const useAuthForm = (defaultIsSignUp: boolean = false) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
          },
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Compte créé avec succès",
            description: "Veuillez vérifier votre email pour confirmer votre compte.",
          });
          navigate("/onboarding");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Vérifier si l'utilisateur a déjà une configuration de boutique
          const { data: storeSettings } = await supabase
            .from('store_settings')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté.",
          });

          // Si l'utilisateur a déjà configuré sa boutique, le rediriger vers le tableau de bord
          // Sinon, le rediriger vers l'onboarding
          if (storeSettings) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        }
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      setError(error.message);
      toast({
        title: "Erreur",
        description: error.message,
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
    error,
  };
};