import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { applyThemeToDOM } from '@/utils/themeUtils';

interface StoreThemeColors {
  primary: string | null;
  secondary: string | null;
}

interface StoreThemeContextValue {
  colors: StoreThemeColors;
  isLoading: boolean;
  refreshTheme: () => Promise<void>;
}

const StoreThemeContext = createContext<StoreThemeContextValue | undefined>(undefined);

interface StoreThemeProviderProps {
  children: React.ReactNode;
  userId?: string;
  storeId?: string;
}

export function StoreThemeProvider({ children, userId, storeId }: StoreThemeProviderProps) {
  const [colors, setColors] = useState<StoreThemeColors>({ primary: null, secondary: null });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndApplyTheme = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Determine which user_id to use for fetching brand settings
      let targetUserId = userId;
      
      // If we have a storeId but no userId, fetch the store owner
      if (storeId && !userId) {
        const { data: storeData } = await supabase
          .from('store_settings')
          .select('user_id')
          .eq('id', storeId)
          .maybeSingle();
        
        if (storeData?.user_id) {
          targetUserId = storeData.user_id;
        }
      }
      
      if (!targetUserId) {
        console.log('No user ID available for theme fetch');
        setIsLoading(false);
        return;
      }

      console.log('🎨 Fetching theme for user:', targetUserId);
      
      const { data: brandSettings, error } = await supabase
        .from('brand_settings')
        .select('primary_color, secondary_color')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching brand settings:', error);
        setIsLoading(false);
        return;
      }

      if (brandSettings) {
        console.log('🎨 Brand settings found:', brandSettings);
        
        const newColors = {
          primary: brandSettings.primary_color,
          secondary: brandSettings.secondary_color,
        };
        
        setColors(newColors);
        if (newColors.primary && newColors.secondary) {
          applyThemeToDOM(newColors.primary, newColors.secondary);
        }
      } else {
        console.log('No brand settings found, using default theme');
      }
    } catch (err) {
      console.error('Error in fetchAndApplyTheme:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, storeId]);

  // Initial fetch
  useEffect(() => {
    fetchAndApplyTheme();
  }, [fetchAndApplyTheme]);

  // Subscribe to realtime changes for instant theme updates
  useEffect(() => {
    if (!userId) return;

    console.log('📡 Setting up realtime subscription for brand_settings');
    
    const channel = supabase
      .channel('brand_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_settings',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔄 Brand settings changed:', payload);
          const newData = payload.new as { primary_color?: string; secondary_color?: string };
          
          if (newData) {
            const newColors = {
              primary: newData.primary_color || null,
              secondary: newData.secondary_color || null,
            };
            setColors(newColors);
            if (newColors.primary && newColors.secondary) {
              applyThemeToDOM(newColors.primary, newColors.secondary);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('📡 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <StoreThemeContext.Provider value={{ colors, isLoading, refreshTheme: fetchAndApplyTheme }}>
      {children}
    </StoreThemeContext.Provider>
  );
}

export function useStoreTheme() {
  const context = useContext(StoreThemeContext);
  if (context === undefined) {
    throw new Error('useStoreTheme must be used within a StoreThemeProvider');
  }
  return context;
}
