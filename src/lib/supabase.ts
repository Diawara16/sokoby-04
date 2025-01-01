import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = "https://zlwvggnzyfldswpgebij.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsd3ZnZ256eWZsZHN3cGdlYmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTEwOTUsImV4cCI6MjA0OTc2NzA5NX0.8qWuWDK2TS87_mlOhXo1oj5CYerMK86LRDPnOF8WysE";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: true // Activer le mode debug pour voir plus de détails
  }
});

// Ajouter un listener global pour les erreurs d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
});