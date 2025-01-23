import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { DomainRouter } from "@/components/landing/DomainRouter";
import { isPlatformDomain } from "@/config/domains";
import { PlatformRoutes } from "@/routes/PlatformRoutes";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function AppRoutes() {
  const { handleSubscribe } = useSubscriptionHandler();
  const hostname = window.location.hostname;
  const queryClient = useQueryClient();
  
  console.log('AppRoutes - Hostname détecté:', hostname);
  console.log('AppRoutes - Est-ce un domaine de la plateforme ?', isPlatformDomain(hostname));

  // Prefetch common data
  useEffect(() => {
    const prefetchData = async () => {
      // Prefetch user profile
      queryClient.prefetchQuery({
        queryKey: ['profile'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;
          
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          return data;
        }
      });

      // Prefetch store settings
      queryClient.prefetchQuery({
        queryKey: ['storeSettings'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data } = await supabase
            .from('store_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          return data;
        }
      });

      // Prefetch notifications count
      queryClient.prefetchQuery({
        queryKey: ['notificationsCount'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return 0;

          const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false);
            
          return count || 0;
        }
      });
    };

    prefetchData();
  }, [queryClient]);

  return (
    !isPlatformDomain(hostname) ? (
      <DomainRouter />
    ) : (
      <PlatformRoutes handleSubscribe={handleSubscribe} />
    )
  );
}