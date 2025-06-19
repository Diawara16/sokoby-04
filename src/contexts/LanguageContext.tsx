import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'zh', 'pt', 'de', 'ar', 'ru', 'it', 'nl'];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Vérifier d'abord le localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }

    // Sinon, détecter la langue du navigateur
    const browserLang = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'fr';
  });

  useEffect(() => {
    // Sauvegarder la langue dans localStorage quand elle change
    localStorage.setItem('language', currentLanguage);
    // Mettre à jour l'attribut lang du document HTML
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
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