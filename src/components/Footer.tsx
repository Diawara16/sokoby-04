import { useState, useEffect } from "react";
import { translations } from "@/translations";
import { QuickLinks } from "./footer/QuickLinks";
import { SocialLinks } from "./footer/SocialLinks";
import { Newsletter } from "./footer/Newsletter";
import { LanguageSelector } from "./footer/LanguageSelector";

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' }
];

export const Footer = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('currentLanguage') || 'fr';
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentLanguage') {
        setCurrentLanguage(event.newValue || 'fr');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    localStorage.setItem('currentLanguage', langCode);
    setCurrentLanguage(langCode);
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'currentLanguage',
      newValue: langCode
    }));
  };

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <footer className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <QuickLinks t={t} />
          <SocialLinks t={t} />
          <Newsletter t={t} />
          <LanguageSelector 
            t={t}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            languages={languages}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;