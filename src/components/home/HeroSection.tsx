
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-red-800 via-red-900 to-red-950 py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="flex-1 text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              Construisez votre empire e-commerce
            </h1>
            <p className="text-xl text-white/90 mb-6">
              La plateforme complète pour lancer et développer votre boutique en ligne
            </p>
          </div>
          
          <div className="flex-1 max-w-md w-full space-y-4">
            <Link to="/inscription" className="w-full block">
              <Button 
                className="w-full bg-white hover:bg-white/90 text-black font-medium text-lg py-6 border-2 border-primary" 
                size="lg"
              >
                Créer mon compte
              </Button>
            </Link>
            <Link to="/connexion" className="w-full block">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-lg py-6 border-2 border-black" 
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
