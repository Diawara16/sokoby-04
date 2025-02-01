import { Button } from "@/components/ui/button";

interface CookieBannerContentProps {
  onAcceptAll: () => void;
  onAcceptNecessary: () => void;
}

export const CookieBannerContent = ({
  onAcceptAll,
  onAcceptNecessary
}: CookieBannerContentProps) => {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-gray-600">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            Les cookies nécessaires sont essentiels au fonctionnement du site. 
            Vous pouvez choisir d'accepter tous les cookies ou uniquement les cookies nécessaires.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAcceptNecessary}
            className="text-xs sm:text-sm"
          >
            Cookies nécessaires uniquement
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onAcceptAll}
            className="text-xs sm:text-sm"
          >
            Accepter tous les cookies
          </Button>
        </div>
      </div>
    </div>
  );
};