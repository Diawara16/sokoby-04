
interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

interface TranslationCache {
  [key: string]: string;
}

class DeepLService {
  private apiKey: string = '';
  private cache: TranslationCache = {};
  private baseUrl = 'https://api-free.deepl.com/v2';

  constructor() {
    // La clé API sera récupérée depuis localStorage ou configuration admin
    this.loadApiKey();
  }

  private loadApiKey() {
    // Récupérer la clé depuis localStorage (configurée via l'admin)
    const storedKey = localStorage.getItem('deepl_api_key');
    this.apiKey = storedKey || '';
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${text}__${targetLang}`;
  }

  async translate(text: string, targetLang: string): Promise<string> {
    // Si c'est déjà en français et on demande français, retourner tel quel
    if (targetLang === 'fr') {
      return text;
    }

    const cacheKey = this.getCacheKey(text, targetLang);
    
    // Vérifier le cache
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    // Si pas de clé API, retourner le texte original
    if (!this.apiKey) {
      console.warn('DeepL API key not configured, returning original text');
      return text;
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
        throw new Error(`DeepL API error: ${response.status}`);
      }

      const data: DeepLResponse = await response.json();
      const translatedText = data.translations[0]?.text || text;

      // Mettre en cache
      this.cache[cacheKey] = translatedText;

      return translatedText;
    } catch (error) {
      console.error('DeepL translation error:', error);
      return text; // Fallback vers le texte original
    }
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
      'ar': 'AR', // Note: DeepL ne supporte pas l'arabe pour l'instant
    };
    return mapping[langCode] || 'EN';
  }

  // Méthode pour précharger des traductions communes
  async preloadCommonTranslations(texts: string[], targetLang: string) {
    const promises = texts.map(text => this.translate(text, targetLang));
    await Promise.all(promises);
  }
}

export const deepLService = new DeepLService();
