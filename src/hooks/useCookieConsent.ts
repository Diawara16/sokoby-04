import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  const checkExistingConsent = async () => {
    try {
      const { data: existingConsent, error } = await supabase
        .from('cookie_consents')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification du consentement:', error);
        return;
      }

      setShowBanner(!existingConsent);
    } catch (error) {
      console.error('Erreur lors de la vérification du consentement:', error);
    }
  };

  const saveConsent = async (preferences: CookiePreferences) => {
    try {
      const { error } = await supabase
        .from('cookie_consents')
        .insert({
          consent_given: true,
          preferences
        });

      if (error) throw error;

      setShowBanner(false);
      toast({
        title: "Préférences enregistrées",
        description: preferences.necessary && !preferences.analytics && !preferences.marketing 
          ? "Seuls les cookies nécessaires seront utilisés."
          : "Vos préférences de cookies ont été sauvegardées.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du consentement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos préférences.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkExistingConsent();
  }, []);

  return {
    showBanner,
    saveConsent
  };
};