import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useTrackEvent = () => {
  const trackEvent = useCallback(async (eventType: string, eventData: any = {}) => {
    try {
      await supabase.from('user_behaviors').insert({
        event_type: eventType,
        page_url: window.location.pathname,
        event_data: eventData
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  return trackEvent;
};