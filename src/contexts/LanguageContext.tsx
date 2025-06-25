
import React, { createContext, useContext, useState, useEffect } from 'react';
import { deepLService } from '@/services/deepLService';

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  isTranslationEnabled: boolean;
  setTranslationEnabled: (enabled: boolean) => void;
  isTranslationReady: boolean;
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
  'Construisez votre empire e-commerce',
  'La plateforme complète pour lancer et développer votre boutique en ligne',
  'Créer mon compte',
  'Se connecter',
  'Deux façons de créer votre boutique',
  'Choisissez l\'approche qui convient le mieux à vos besoins et à votre style'
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

  const [isTranslationReady, setIsTranslationReady] = useState(false);

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
    document.documentElement.lang = currentLanguage;

    // Vérifier si DeepL est configuré
    setIsTranslationReady(deepLService.isReady());

    // Précharger les traductions communes si on change de langue
    if (isTranslationEnabled && currentLanguage !== 'fr' && deepLService.isReady()) {
      deepLService.preloadCommonTranslations(COMMON_TEXTS, currentLanguage)
        .then(() => {
          console.log(`Traductions préchargées pour ${currentLanguage}`);
        })
        .catch((error) => {
          console.error('Erreur lors du préchargement:', error);
        });
    }
  }, [currentLanguage, isTranslationEnabled]);

  useEffect(() => {
    localStorage.setItem('translationEnabled', JSON.stringify(isTranslationEnabled));
    setIsTranslationReady(deepLService.isReady());
  }, [isTranslationEnabled]);

  const handleLanguageChange = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setCurrentLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setCurrentLanguage: handleLanguageChange,
      isTranslationEnabled,
      setTranslationEnabled,
      isTranslationReady,
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
