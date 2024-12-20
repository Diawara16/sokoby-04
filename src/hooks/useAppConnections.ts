import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useAppConnections = () => {
  const [connectedApps, setConnectedApps] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadConnectedApps = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: connections, error } = await supabase
        .from('app_connections')
        .select('app_name, status')
        .eq('user_id', user.id);

      if (error) throw error;

      const connectedStatus = connections.reduce((acc, conn) => ({
        ...acc,
        [conn.app_name]: conn.status === 'active'
      }), {});

      setConnectedApps(connectedStatus);
    } catch (error) {
      console.error('Erreur lors du chargement des applications connectées:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'état des connexions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (appName: string, authUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour utiliser cette fonctionnalité",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('app_connections')
        .upsert({
          user_id: user.id,
          app_name: appName,
          status: 'active',
          connected_at: new Date().toISOString(),
        });

      if (error) throw error;

      setConnectedApps(prev => ({
        ...prev,
        [appName]: true
      }));

      toast({
        title: "Connexion réussie",
        description: `L'application ${appName} a été connectée avec succès.`,
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast({
        title: "Erreur",
        description: "La connexion a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (appName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('app_connections')
        .update({ status: 'inactive' })
        .eq('user_id', user.id)
        .eq('app_name', appName);

      if (error) throw error;

      setConnectedApps(prev => ({
        ...prev,
        [appName]: false
      }));

      toast({
        title: "Déconnexion réussie",
        description: `L'application ${appName} a été déconnectée.`,
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "La déconnexion a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadConnectedApps();
  }, []);

  return {
    connectedApps,
    isLoading,
    handleConnect,
    handleDisconnect
  };
};