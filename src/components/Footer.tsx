import { useState } from "react";
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

const Footer = () => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const t = translations[currentLanguage as keyof typeof translations];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    console.log('Langue changée pour:', langCode);
  };

  return (
    <footer className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-gray-100 py-12 mt-20">
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