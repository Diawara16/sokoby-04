import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";

interface StoreCreationButtonsProps {
  variant?: "hero" | "cta" | "card";
}

// All stores are now LIVE production stores - AI creation is disabled
export const StoreCreationButtons = ({ variant = "hero" }: StoreCreationButtonsProps) => {
  // For live stores, show dashboard access button only
  if (variant === "card") {
    return (
      <div className="grid gap-3">
        <Button
          className="w-full h-auto p-4 flex flex-col items-center gap-2"
          asChild
        >
          <Link to="/tableau-de-bord">
            <Store className="h-5 w-5" />
            <div className="text-center">
              <div className="font-medium">Accéder au tableau de bord</div>
              <div className="text-xs text-primary-foreground/80">Gérer votre boutique LIVE</div>
            </div>
          </Link>
        </Button>
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-primary/10 text-lg px-8 py-4 font-semibold"
          asChild
        >
          <Link to="/tableau-de-bord">
            🏪 Accéder à ma boutique
          </Link>
        </Button>
      </div>
    );
  }

  // Default hero variant
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <Button
        size="lg"
        className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium text-lg py-6"
        asChild
      >
        <Link to="/tableau-de-bord">
          🏪 Ma Boutique
        </Link>
      </Button>
    </div>
  );
};
