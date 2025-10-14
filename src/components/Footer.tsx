
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

const MobileApps = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        <T>Applications mobiles</T>
      </h3>
      <p className="text-sm text-gray-300 mb-4">
        <T>Gérez votre boutique partout</T>
      </p>
      <div className="space-y-3">
        <a 
          href="#" 
          className="flex items-center space-x-3 bg-black rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div>
            <div className="text-xs text-gray-300"><T>Télécharger sur l'</T></div>
            <div className="text-sm font-semibold">App Store</div>
          </div>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 bg-black rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
          </svg>
          <div>
            <div className="text-xs text-gray-300"><T>Disponible sur</T></div>
            <div className="text-sm font-semibold">Google Play</div>
          </div>
        </a>
      </div>
    </div>
  );
};

export const Footer = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  return (
    <footer className="w-full bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-gray-100 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
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
          <MobileApps />
          
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
