import { useState, useEffect } from 'react';
import { useBrandSettings } from '@/hooks/useBrandSettings';

export const useDynamicLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchBrandSettings } = useBrandSettings();

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const settings = await fetchBrandSettings();
        setLogoUrl(settings?.logo_url || null);
      } catch (error) {
        console.error('Error loading logo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogo();
  }, [fetchBrandSettings]);

  return { logoUrl, loading };
};