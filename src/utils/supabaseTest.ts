import { supabase } from "@/integrations/supabase/client";

// Test de connexion basique à Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Test 1: Vérifier la connectivité de base
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Supabase connection test successful:", data);
    return { success: true, message: "Connexion à Supabase réussie" };
    
  } catch (err: any) {
    console.error("Supabase connection test error:", err);
    return { success: false, error: err.message || "Erreur de connexion inconnue" };
  }
};

// Test d'inscription ultra-simple
export const testBasicSignUp = async (email: string, password: string) => {
  try {
    console.log("Testing basic signup...");
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error("Basic signup test failed:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Basic signup test successful:", data);
    return { success: true, data };
    
  } catch (err: any) {
    console.error("Basic signup test error:", err);
    return { success: false, error: err.message || "Erreur d'inscription inconnue" };
  }
};