import { LoginForm } from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isPreviewEnv } from "@/utils/env";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const redirectToDestination = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!active || !user) return;
      // Always redirect to live store dashboard
      navigate("/tableau-de-bord", { replace: true });
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