import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { translations } from "@/translations";
import { Navigation } from "@/components/home/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const navigate = useNavigate();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('currentLanguage');
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentLanguage') {
        setCurrentLanguage(event.newValue || 'fr');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Vérification de l'authentification
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleCreateStore = () => {
    navigate('/onboarding');
  };

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/e423a6d8-87e5-4ef9-af43-7e96b44fd685.png" 
                  alt="Sokoby" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <Navigation currentLanguage={currentLanguage} />
            <Button 
              variant="default" 
              className="bg-red-600 hover:bg-red-700 transition-colors duration-200"
              onClick={handleCreateStore}
            >
              {t.cta.button}
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection 
        isAuthenticated={isAuthenticated}
        currentLanguage={currentLanguage}
      />
      
      <FeaturesSection currentLanguage={currentLanguage} />
      
      <CTASection 
        currentLanguage={currentLanguage}
        onCreateStore={handleCreateStore}
      />

      <Footer />
    </div>
  );
};

export default Index;