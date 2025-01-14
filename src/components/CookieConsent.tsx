import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConsent = async () => {
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

    checkConsent();
  }, []);

  const handleAcceptAll = async () => {
    try {
      const { error } = await supabase
        .from('cookie_consents')
        .insert({
          consent_given: true,
          preferences: {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
          }
        });

      if (error) throw error;

      setShowBanner(false);
      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences de cookies ont été sauvegardées.",
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

  const handleAcceptNecessary = async () => {
    try {
      const { error } = await supabase
        .from('cookie_consents')
        .insert({
          consent_given: true,
          preferences: {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
          }
        });

      if (error) throw error;

      setShowBanner(false);
      toast({
        title: "Préférences enregistrées",
        description: "Seuls les cookies nécessaires seront utilisés.",
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

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
              Les cookies nécessaires sont essentiels au fonctionnement du site. 
              Vous pouvez choisir d'accepter tous les cookies ou uniquement les cookies nécessaires.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAcceptNecessary}
            >
              Cookies nécessaires uniquement
            </Button>
            <Button
              variant="default"
              onClick={handleAcceptAll}
            >
              Accepter tous les cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};