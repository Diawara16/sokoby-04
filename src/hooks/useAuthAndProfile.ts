import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string | null;
  trial_ends_at: string | null;
  features_usage: any;
  last_login: string | null;
}

export const useAuthAndProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsAuthenticated(!!session);
        
        if (session) {
          let { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching profile:', error);
          }
          
          // Si pas de profil, on le crée automatiquement
          if (!profile && session.user) {
            console.log('Creating missing profile for user:', session.user.email);
            const trialEndsAt = new Date();
            trialEndsAt.setDate(trialEndsAt.getDate() + 14);

            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ 
                id: session.user.id, 
                email: session.user.email,
                trial_ends_at: trialEndsAt.toISOString(),
                features_usage: {},
                last_login: new Date().toISOString()
              }]);

            if (insertError) {
              console.error('Error creating profile:', insertError);
              toast({
                title: "Erreur",
                description: "Impossible de créer votre profil",
                variant: "destructive",
              });
              setHasProfile(false);
              setProfile(null);
            } else {
              // Récupérer le profil créé
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              console.log('Profile created successfully:', newProfile);
              setHasProfile(true);
              setProfile(newProfile);
              
              toast({
                title: "Bienvenue !",
                description: "Votre profil a été créé avec 14 jours d'essai gratuit.",
              });
            }
          } else {
            console.log('Profile data:', profile);
            setHasProfile(!!profile);
            setProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de l'authentification",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      setSession(session);
      
      // Après un login réussi, on vérifie le profil
      if (event === 'SIGNED_IN' && session) {
        setTimeout(() => {
          checkAuth();
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return {
    isAuthenticated,
    isLoading,
    hasProfile,
    session,
    profile
  };
};