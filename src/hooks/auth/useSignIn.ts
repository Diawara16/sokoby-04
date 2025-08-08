import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });

        // Redirect based on store existence
        const { data: existingStore } = await supabase
          .from('store_settings')
          .select('user_id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        navigate(existingStore ? "/store-editor" : "/tableau-de-bord");
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
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
    isLoading,
    error,
    handleSignIn,
  };
};