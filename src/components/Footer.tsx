
import { useState, useEffect } from "react";
import { translations } from "@/translations";
import { QuickLinks } from "./footer/QuickLinks";
import { SocialLinks } from "./footer/SocialLinks";
import { Newsletter } from "./footer/Newsletter";
import { LanguageSelector } from "./footer/LanguageSelector";
import { CreditCard, Bitcoin, DollarSign, Wallet, Globe } from "lucide-react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { T } from "@/components/translation/T";

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

const PaymentMethods = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        <T>Moyens de paiement acceptés</T>
      </h3>
      <div className="flex space-x-4">
        <CreditCard className="w-8 h-8 text-white" />
        <DollarSign className="w-8 h-8 text-white" />
        <Bitcoin className="w-8 h-8 text-white" />
        <Wallet className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export const Footer = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('currentLanguage', langCode);
  };

  return (
    <footer className="w-full bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-gray-100 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              <T>Liens rapides</T>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/legal" className="text-gray-300 hover:text-white transition-colors">
                  <T>Mentions légales</T>
                </a>
              </li>
              <li>
                <a href="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                  <T>Accessibilité</T>
                </a>
              </li>
              <li>
                <a href="/conditions" className="text-gray-300 hover:text-white transition-colors">
                  <T>Conditions d'utilisation</T>
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-300 hover:text-white transition-colors">
                  <T>Support</T>
                </a>
              </li>
            </ul>
          </div>

          <SocialLinks t={t} />
          <Newsletter t={t} />
          <PaymentMethods />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <T>Changer de langue</T>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`text-left text-sm hover:text-red-400 transition-colors ${
                    currentLanguage === lang.code ? 'text-red-400 font-semibold' : 'text-gray-300'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-red-600">
          <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Sokoby. <T>Tous droits réservés</T></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
