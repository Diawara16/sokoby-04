import { useState, useEffect, useCallback } from 'react';
import { useBrandSettings } from '@/hooks/useBrandSettings';

export const useDynamicLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchBrandSettings } = useBrandSettings();

  const loadLogo = useCallback(async () => {
    try {
      setLoading(true);
      const settings = await fetchBrandSettings();
      setLogoUrl(settings?.logo_url || null);
    } catch (error) {
      console.error('Error loading logo:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchBrandSettings]);

  useEffect(() => {
    loadLogo();

    // Listen for logo update events
    const handleLogoUpdate = () => {
      loadLogo();
    };

    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('logo-updated', handleLogoUpdate);
  }, [loadLogo]);

  return { logoUrl, loading, refreshLogo: loadLogo };
};