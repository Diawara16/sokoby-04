import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PriceChangeNotification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  read: boolean;
}

export const usePriceChangeNotification = () => {
  const [notification, setNotification] = useState<PriceChangeNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPriceChangeNotification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error }: any = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'price_change')
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching price change notification:', error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les notifications",
            variant: "destructive",
          });
        } else if (data) {
          setNotification(data);
        }
      } catch (error) {
        console.error('Error in usePriceChangeNotification:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceChangeNotification();

    // Écouter les nouvelles notifications en temps réel
    const channel = supabase
      .channel('price_change_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'type=eq.price_change',
        },
        async (payload: any) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && payload.new.user_id === user.id) {
            setNotification(payload.new as PriceChangeNotification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      setNotification(null);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive",
      });
    }
  };

  return {
    notification,
    loading,
    markAsRead,
  };
};
