
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { T } from "@/components/translation/T";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-red-800 via-red-900 to-red-950 py-8 sm:py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12">
          <div className="flex-1 text-white text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
              <T>Construisez votre empire e-commerce</T>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6">
              <T>La plateforme complète pour lancer et développer votre boutique en ligne</T>
            </p>
          </div>
          
          <div className="flex-1 max-w-md w-full space-y-3 sm:space-y-4">
            <Link to="/inscription" className="w-full block">
              <Button 
                className="w-full bg-white hover:bg-white/90 text-black font-medium text-base sm:text-lg py-5 sm:py-6 border-2 border-primary" 
                size="lg"
              >
                <T>Créer mon compte</T>
              </Button>
            </Link>
            <Link to="/connexion" className="w-full block">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-base sm:text-lg py-5 sm:py-6 border-2 border-black" 
                size="lg"
              >
                <T>Se connecter</T>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
