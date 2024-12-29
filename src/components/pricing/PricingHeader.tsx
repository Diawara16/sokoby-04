import { translations } from "@/translations";
import { Button } from "@/components/ui/button";

interface PricingHeaderProps {
  currentLanguage: string;
  isAuthenticated: boolean;
  onShowAuthForm: () => void;
}

export const PricingHeader = ({
  currentLanguage,
  isAuthenticated,
  onShowAuthForm,
}: PricingHeaderProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-black mb-4">{t.pricing.title}</h1>
      <p className="text-xl text-black mb-6">{t.pricing.subtitle}</p>
      {!isAuthenticated && (
        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Connectez-vous pour commencer votre abonnement
          </p>
          <Button
            onClick={onShowAuthForm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Se connecter
          </Button>
        </div>
      )}
    </div>
  );
};