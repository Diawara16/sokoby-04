
import { supabase } from "@/lib/supabase";

export const authService = {
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signUp(email: string, password: string) {
    // Calculer la date de fin d'essai (14 jours à partir d'aujourd'hui)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/tableau-de-bord`,
        data: {
          plan: "essai_gratuit",
          trial_ends_at: trialEndsAt.toISOString(),
        },
      },
    });
  },
};
