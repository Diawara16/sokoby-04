import { useCookieConsent } from "@/hooks/useCookieConsent";
import { CookieBannerContent } from "./cookie-consent/CookieBannerContent";

export const CookieConsent = () => {
  const { showBanner, saveConsent } = useCookieConsent();

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
  };

  const handleAcceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <CookieBannerContent
        onAcceptAll={handleAcceptAll}
        onAcceptNecessary={handleAcceptNecessary}
      />
    </div>
  );
};