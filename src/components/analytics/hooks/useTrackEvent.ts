import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useTrackEvent = () => {
  const trackEvent = useCallback(async (eventType: string, eventData: any = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Ne pas tracker si pas d'utilisateur connecté
      
      await supabase.from('user_behaviors').insert({
        event_type: eventType,
        page_url: window.location.pathname,
        event_data: eventData,
        user_id: user.id
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  return trackEvent;
};