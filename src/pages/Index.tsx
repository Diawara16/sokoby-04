import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { translations } from "@/translations";
import { Navigation } from "@/components/home/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import ShoppingInspirationSection from "@/components/home/ShoppingInspirationSection";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('currentLanguage') || 'fr';
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentLanguage') {
        setCurrentLanguage(event.newValue || 'fr');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const t = translations[currentLanguage as keyof typeof translations];

  if (!t?.navigation?.home || !t?.cta?.button || 
      typeof t.navigation.home !== 'string' || 
      typeof t.cta.button !== 'string') {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Sokoby - Créez votre boutique en ligne en quelques clics</title>
        <meta name="description" content="Sokoby vous permet de créer et gérer facilement votre boutique en ligne. Commencez gratuitement et développez votre business e-commerce dès aujourd'hui." />
        <link rel="canonical" href="https://sokoby.com" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center" aria-label="Accueil Sokoby">
                  <img 
                    src="/lovable-uploads/e423a6d8-87e5-4ef9-af43-7e96b44fd685.png" 
                    alt="Logo Sokoby" 
                    className="h-14 w-auto"
                    width="56"
                    height="56"
                  />
                </Link>
              </div>
              <Navigation currentLanguage={currentLanguage} />
            </div>
          </div>
        </header>

        <main id="main-content" role="main" className="flex-1">
          <HeroSection 
            isAuthenticated={isAuthenticated}
            currentLanguage={currentLanguage}
          />
          
          <FeaturesSection currentLanguage={currentLanguage} />
          
          <CTASection 
            currentLanguage={currentLanguage}
            onCreateStore={() => navigate('/onboarding')}
          />

          <ShoppingInspirationSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;