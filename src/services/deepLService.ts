import { supabase } from '@/integrations/supabase/client';

interface TranslationCache {
  [key: string]: string;
}

interface TranslationOptions {
  skipCache?: boolean;
  fallback?: string;
  context?: string;
}

class DeepLService {
  private cache: TranslationCache = {};
  private isConfigured = true; // Always true now that key is server-side

  public isReady(): boolean {
    return this.isConfigured;
  }

  private getCacheKey(text: string, targetLang: string, context?: string): string {
    return `${text}__${targetLang}__${context || 'default'}`;
  }

  async translate(text: string, targetLang: string, options: TranslationOptions = {}): Promise<string> {
    if (targetLang === 'fr') {
      return text;
    }

    if (!text?.trim()) {
      return text;
    }

    const cacheKey = this.getCacheKey(text, targetLang, options.context);
    
    if (!options.skipCache && this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text,
          targetLang: this.mapLanguageCode(targetLang),
          sourceLang: 'FR',
        },
      });

      if (error) {
        throw error;
      }

      const translatedText = data?.translatedText || options.fallback || text;
      this.cache[cacheKey] = translatedText;
      return translatedText;
    } catch (error) {
      console.error('DeepL translation error:', error);
      return options.fallback || text;
    }
  }

  async translateBatch(texts: string[], targetLang: string, options: TranslationOptions = {}): Promise<string[]> {
    if (targetLang === 'fr') {
      return texts;
    }

    const results: string[] = [];
    
    for (const text of texts) {
      try {
        const translated = await this.translate(text, targetLang, options);
        results.push(translated);
      } catch (error) {
        console.error('Batch translation error for text:', text, error);
        results.push(options.fallback || text);
      }
    }

    return results;
  }

  private mapLanguageCode(langCode: string): string {
    const mapping: { [key: string]: string } = {
      'en': 'EN',
      'es': 'ES',
      'de': 'DE',
      'fr': 'FR',
      'it': 'IT',
      'pt': 'PT',
      'ru': 'RU',
      'zh': 'ZH',
      'nl': 'NL',
      'ar': 'EN', // Fallback to English for unsupported languages
    };
    return mapping[langCode] || 'EN';
  }

  async preloadCommonTranslations(texts: string[], targetLang: string) {
    if (targetLang === 'fr') return;
    
    const promises = texts.map(text => this.translate(text, targetLang));
    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Preload translations error:', error);
    }
  }

  clearCache() {
    this.cache = {};
  }

  getCacheStats() {
    return {
      totalCached: Object.keys(this.cache).length,
      isConfigured: this.isConfigured,
    };
  }

  // Deprecated methods - no longer needed with server-side key
  public setApiKey(_key: string) {
    console.warn('setApiKey is deprecated - DeepL key is now managed server-side');
  }
}

export const deepLService = new DeepLService();
