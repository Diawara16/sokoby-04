
import React, { createContext, useContext, useState, useEffect } from 'react';
import { deepLService } from '@/services/deepLService';

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  isTranslationEnabled: boolean;
  setTranslationEnabled: (enabled: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'zh', 'pt', 'de', 'ar', 'ru', 'it', 'nl'];

// Textes communs à précharger
const COMMON_TEXTS = [
  'Accueil',
  'Tarifs', 
  'Contact',
  'Se connecter',
  'S\'inscrire',
  'Créer ma boutique',
  'Démarrer l\'essai gratuit',
  'En savoir plus',
  'Suivant',
  'Précédent',
  'Sauvegarder',
  'Annuler',
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }

    const browserLang = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'fr';
  });

  const [isTranslationEnabled, setTranslationEnabled] = useState(() => {
    const saved = localStorage.getItem('translationEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
    document.documentElement.lang = currentLanguage;

    // Précharger les traductions communes
    if (isTranslationEnabled && currentLanguage !== 'fr') {
      deepLService.preloadCommonTranslations(COMMON_TEXTS, currentLanguage);
    }
  }, [currentLanguage, isTranslationEnabled]);

  useEffect(() => {
    localStorage.setItem('translationEnabled', JSON.stringify(isTranslationEnabled));
  }, [isTranslationEnabled]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setCurrentLanguage: handleLanguageChange,
      isTranslationEnabled,
      setTranslationEnabled,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
