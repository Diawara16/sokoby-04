import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { translations } from "@/translations";
import { Navigation } from "@/components/home/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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

  const handleCreateStore = () => {
    navigate('/onboarding');
  };

  const handleTestPayment = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer un paiement",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log('Création de la session de paiement...');
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { planType: 'starter' }
      });

      console.log('Réponse reçue:', { data, error });

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la session de paiement",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        console.log('Redirection vers:', data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la session de paiement",
        variant: "destructive",
      });
    }
  };

  const t = translations[currentLanguage as keyof typeof translations];

  if (!t?.navigation?.home || !t?.cta?.button || 
      typeof t.navigation.home !== 'string' || 
      typeof t.cta.button !== 'string') {
    return null;
  }

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
                  className="h-14 w-auto"
                />
              </Link>
            </div>
            <Navigation currentLanguage={currentLanguage} />
          </div>
        </div>
      </nav>

      <div className="flex-1">
        <HeroSection 
          isAuthenticated={isAuthenticated}
          currentLanguage={currentLanguage}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            onClick={handleTestPayment}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Tester le paiement Stripe
          </Button>
        </div>
        
        <div className="mt-12">
          <FeaturesSection currentLanguage={currentLanguage} />
        </div>
        
        <CTASection 
          currentLanguage={currentLanguage}
          onCreateStore={handleCreateStore}
        />

        <div className="h-24" />
      </div>

      <Footer />
    </div>
  );
};

export default Index;