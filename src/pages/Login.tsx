import { LoginForm } from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const redirectToDestination = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!active || !user) return;
      
      // Check for pending redirect after login (e.g., from checkout flow)
      const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
      if (redirectAfterLogin) {
        console.log('[Login] Found redirectAfterLogin, navigating to:', redirectAfterLogin);
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectAfterLogin, { replace: true });
        return;
      }
      
      // Check for LIVE production store
      const { data: existingStore } = await supabase
        .from('store_settings')
        .select('is_production')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingStore?.is_production) {
        // LIVE store: redirect to storefront
        navigate("/boutique", { replace: true });
      } else {
        // No live store: redirect to dashboard
        navigate("/tableau-de-bord", { replace: true });
      }
    };

    // If already authenticated, redirect immediately
    redirectToDestination();

    // Listen for future auth changes
   const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Defer to avoid doing supabase calls inside callback
        setTimeout(() => {
          redirectToDestination();
        }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;