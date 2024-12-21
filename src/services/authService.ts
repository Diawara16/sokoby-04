import { supabase } from "@/lib/supabase";

export const authService = {
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          plan: "gratuit",
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    });
  },
};