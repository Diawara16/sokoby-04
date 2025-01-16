import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isAuthenticated: boolean;
  currentLanguage: string;
}

export function HeroSection({ isAuthenticated, currentLanguage }: HeroSectionProps) {
  return (
    <section className="relative bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Créez votre boutique en ligne en quelques minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Une solution complète pour lancer et gérer votre business en ligne. Simple, rapide et efficace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <>
                <Link to="/essai-gratuit">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    Démarrer gratuitement
                  </Button>
                </Link>
                <Link to="/plan-tarifaire">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Voir les tarifs
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}