import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";
import { linkAuthenticatedUserToStore } from "@/services/linkAuthenticatedUserToStore";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fresh auth-link sync on login (signup + invite acceptance support)
        try {
          await linkAuthenticatedUserToStore(data.user.id, data.user.email ?? normalizedEmail);
        } catch (linkError) {
          console.warn("[useSignIn] Store linking warning:", linkError);
        }

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });

        const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
        if (redirectAfterLogin) {
          console.log("[useSignIn] Found redirectAfterLogin, navigating to:", redirectAfterLogin);
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectAfterLogin, { replace: true });
          return;
        }

        const { data: existingStore } = await supabase
          .from("store_settings")
          .select("user_id, is_production")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (existingStore?.is_production) {
          navigate("/boutique", { replace: true });
        } else {
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
