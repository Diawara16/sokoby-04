
import { useState, useEffect, useCallback } from 'react';
import { deepLService } from '@/services/deepLService';
import { useLanguageContext } from '@/contexts/LanguageContext';

interface UseDeepLTranslationOptions {
  fallback?: string;
  skipTranslation?: boolean;
}

export function useDeepLTranslation(
  text: string, 
  options: UseDeepLTranslationOptions = {}
) {
  const { currentLanguage } = useLanguageContext();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = useCallback(async () => {
    if (options.skipTranslation || currentLanguage === 'fr' || !text.trim()) {
      setTranslatedText(text);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const translated = await deepLService.translate(text, currentLanguage);
      setTranslatedText(translated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      setTranslatedText(options.fallback || text);
    } finally {
      setIsLoading(false);
    }
  }, [text, currentLanguage, options.fallback, options.skipTranslation]);

  useEffect(() => {
    translateText();
  }, [translateText]);

  return {
    translatedText,
    isLoading,
    error,
    refresh: translateText,
  };
}

// Hook simplifié pour les cas d'usage courants
export function useTranslation(text: string): string {
  const { translatedText } = useDeepLTranslation(text);
  return translatedText;
}
