import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useTrackBehavior = () => {
  const trackEvent = useCallback(async (eventType: string, eventData: any = {}) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from('user_behaviors').insert({
        user_id: session.user.id,
        event_type: eventType,
        event_data: eventData,
        page_url: window.location.pathname,
        session_id: session.access_token
      });

      console.log('Behavior tracked:', eventType);
    } catch (error) {
      console.error('Error tracking behavior:', error);
    }
  }, []);

  return { trackEvent };
};