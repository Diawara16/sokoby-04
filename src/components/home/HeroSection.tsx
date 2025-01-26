import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isAuthenticated: boolean;
  currentLanguage: string;
}

export function HeroSection({ isAuthenticated, currentLanguage }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-red-800 via-red-900 to-red-950 py-20 lg:py-32">
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
          
          <div className="flex-1 max-w-md w-full space-y-4">
            <Link to="/register" className="w-full block">
              <Button 
                className="w-full bg-white hover:bg-white/90 text-black font-medium text-lg py-6" 
                size="lg"
              >
                Créer mon compte
              </Button>
            </Link>
            <Link to="/login" className="w-full block">
              <Button 
                variant="outline" 
                className="w-full border-2 border-white text-white hover:bg-[#ea384c]/10 font-medium text-lg py-6" 
                size="lg"
              >
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}