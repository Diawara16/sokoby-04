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
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });

        // Check for LIVE production store and redirect accordingly
        const { data: existingStore } = await supabase
          .from('store_settings')
          .select('user_id, is_production')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (existingStore?.is_production) {
          // LIVE store: redirect to storefront
          navigate("/boutique", { replace: true });
        } else if (existingStore) {
          // Store exists but not live: redirect to dashboard
          navigate("/tableau-de-bord", { replace: true });
        } else {
          // No store: redirect to dashboard
          navigate("/tableau-de-bord", { replace: true });
        }
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