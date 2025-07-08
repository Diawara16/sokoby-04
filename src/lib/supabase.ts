import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = "https://sydqmpmsqbyffbcbnwod.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5ZHFtcG1zcWJ5ZmZiY2Jud29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NjU2NzgsImV4cCI6MjA2NzQ0MTY3OH0.tBSM-F2dbw-sb9d4kc4IvPbm7b93lDSYJqIOTtMnmzQ";

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