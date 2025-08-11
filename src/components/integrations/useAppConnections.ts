import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export type AppConnection = {
  app_name: string;
  status: string;
};

export const useAppConnections = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase
          .from('app_connections')
          .select('app_name, status')
          .eq('user_id', user.id);
        if (error) throw error;
        if (!isMounted) return;
        const map: Record<string, string> = {};
        (data || []).forEach((c) => { map[c.app_name?.toLowerCase?.()] = c.status; });
        setConnections(map);
      } catch (e) {
        console.error('Erreur chargement intégrations', e);
        toast({ title: 'Erreur', description: "Impossible de charger les intégrations", variant: 'destructive' });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [toast]);

  return { connections, isLoading };
};
