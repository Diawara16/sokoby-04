import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isAuthenticated: boolean;
  currentLanguage: string;
}

export function HeroSection({ isAuthenticated, currentLanguage }: HeroSectionProps) {
  return (
    <section className="relative bg-primary py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Construisez votre empire e-commerce
            </h1>
            <p className="text-xl text-white/90 mb-8">
              La plateforme complète pour lancer et développer votre boutique en ligne
            </p>
          </div>
          
          <div className="flex-1 max-w-md w-full bg-white rounded-lg p-8">
            <div className="space-y-4">
              <Link to="/register" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
                  Créer mon compte
                </Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white" size="lg">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}