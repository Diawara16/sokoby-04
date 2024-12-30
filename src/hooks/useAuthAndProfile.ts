import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export const useAuthAndProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsAuthenticated(!!session);
        
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching profile:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger votre profil",
              variant: "destructive",
            });
            setHasProfile(false);
          } else {
            console.log('Profile data:', profile);
            setHasProfile(!!profile);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return {
    isAuthenticated,
    isLoading,
    hasProfile,
    session
  };
};