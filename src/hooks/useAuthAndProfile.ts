import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { checkUserAccess, type AccessLevel } from "@/hooks/useAccessControl";
import { linkAuthenticatedUserToStore } from "@/services/linkAuthenticatedUserToStore";

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
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("blocked");
  const [accessDaysLeft, setAccessDaysLeft] = useState<number | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setIsAuthenticated(!!session);

        if (!session) {
          setHasProfile(false);
          setProfile(null);
          setHasPaidAccess(false);
          setAccessLevel("blocked");
          setAccessDaysLeft(undefined);
          return;
        }

        // Fresh linkage pass on every login/session restore (no cache)
        await linkAuthenticatedUserToStore(session.user.id, session.user.email);

        let { data: currentProfile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
        }

        // Create missing profile automatically
        if (!currentProfile) {
          console.log("Creating missing profile for user:", session.user.email);
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + 14);

          const { error: insertError } = await supabase.from("profiles").insert([
            {
              id: session.user.id,
              user_id: session.user.id,
              email: session.user.email,
              trial_ends_at: trialEndsAt.toISOString(),
              features_usage: {},
              last_login: new Date().toISOString(),
            },
          ]);

          if (insertError) {
            console.error("Error creating profile:", insertError);
            toast({
              title: "Erreur",
              description: "Impossible de créer votre profil",
              variant: "destructive",
            });
            setHasProfile(false);
            setProfile(null);
          } else {
            const { data: newProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            currentProfile = newProfile;
            setHasProfile(true);
            setProfile(newProfile);

            toast({
              title: "Bienvenue !",
              description: "Votre profil a été créé avec 14 jours d'essai gratuit.",
            });
          }
        } else {
          setHasProfile(true);
          setProfile(currentProfile);
        }

        const access = await checkUserAccess(session.user.id, session.user.email);
        const paid = access.level === "paid";

        setHasPaidAccess(paid);
        setAccessLevel(access.level);
        setAccessDaysLeft(access.daysLeft);

        // Clear stale in-memory trial state when plan is paid
        if (paid) {
          setProfile((prev) => (prev ? { ...prev, trial_ends_at: null } : prev));
        }

        console.log("[useAuthAndProfile] Access summary:", {
          userId: session.user.id,
          email: session.user.email,
          accessLevel: access.level,
          hasPaidAccess: paid,
        });
      } catch (error) {
        console.error("Error checking auth:", error);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setSession(session);

      if (event === "SIGNED_IN" && session) {
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
    profile,
    hasPaidAccess,
    accessLevel,
    accessDaysLeft,
  };
};

