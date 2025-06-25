
interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

interface TranslationCache {
  [key: string]: string;
}

interface TranslationOptions {
  skipCache?: boolean;
  fallback?: string;
  context?: string;
}

class DeepLService {
  private apiKey: string = '';
  private cache: TranslationCache = {};
  private baseUrl = 'https://api-free.deepl.com/v2';
  private isConfigured = false;

  constructor() {
    this.loadApiKey();
  }

  private loadApiKey() {
    const storedKey = localStorage.getItem('deepl_api_key');
    this.apiKey = storedKey || '';
    this.isConfigured = !!this.apiKey;
  }

  public setApiKey(key: string) {
    this.apiKey = key;
    this.isConfigured = !!key;
    localStorage.setItem('deepl_api_key', key);
  }

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

    if (!this.isConfigured) {
      console.warn('DeepL API key not configured, returning fallback or original text');
      return options.fallback || text;
    }

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          target_lang: this.mapLanguageCode(targetLang),
          source_lang: 'FR',
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepL API error: ${response.status} - ${response.statusText}`);
      }

      const data: DeepLResponse = await response.json();
      const translatedText = data.translations[0]?.text || text;

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
    if (targetLang === 'fr' || !this.isConfigured) return;
    
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
}

export const deepLService = new DeepLService();
