
import { useState, useEffect, useCallback, useRef } from 'react';
import { deepLService } from '@/services/deepLService';
import { useLanguageContext } from '@/contexts/LanguageContext';

interface UseDeepLTranslationOptions {
  fallback?: string;
  skipTranslation?: boolean;
  context?: string;
}

export function useDeepLTranslation(
  text: string, 
  options: UseDeepLTranslationOptions = {}
) {
  const { currentLanguage, isTranslationEnabled, isTranslationReady } = useLanguageContext();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const translateText = useCallback(async () => {
    // Si la traduction est désactivée ou si c'est déjà en français
    if (!isTranslationEnabled || options.skipTranslation || currentLanguage === 'fr' || !text.trim()) {
      setTranslatedText(text);
      setIsLoading(false);
      return;
    }

    // Si DeepL n'est pas prêt, utiliser le fallback
    if (!isTranslationReady) {
      setTranslatedText(options.fallback || text);
      setIsLoading(false);
      return;
    }

    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const translated = await deepLService.translate(text, currentLanguage, {
        fallback: options.fallback,
        context: options.context,
      });
      
      setTranslatedText(translated);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Requête annulée, ne pas traiter l'erreur
      }
      
      setError(err instanceof Error ? err.message : 'Translation failed');
      setTranslatedText(options.fallback || text);
    } finally {
      setIsLoading(false);
    }
  }, [text, currentLanguage, options.fallback, options.skipTranslation, options.context, isTranslationEnabled, isTranslationReady]);

  useEffect(() => {
    translateText();
    
    // Cleanup function pour annuler les requêtes en cours
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [translateText]);

  return {
    translatedText,
    isLoading,
    error,
    refresh: translateText,
  };
}

// Hook simplifié pour les cas d'usage courants
export function useTranslation(text: string, options?: UseDeepLTranslationOptions): string {
  const { translatedText } = useDeepLTranslation(text, options);
  return translatedText;
}
