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

      <main className="flex-1">
        <HeroSection 
          isAuthenticated={isAuthenticated}
          currentLanguage={currentLanguage}
        />
        
        <CTASection 
          currentLanguage={currentLanguage}
          onCreateStore={handleCreateStore}
        />

        <FeaturesSection currentLanguage={currentLanguage} />

        {/* Shopping Inspiration Section */}
        <section className="py-16 bg-white w-full">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Inspirations Shopping</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  alt="Inspiration shopping 1"
                  className="w-full h-72 object-cover transform transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-xl font-semibold">Découvrez notre collection</h3>
                    <p className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explorez nos dernières tendances
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86"
                  alt="Inspiration shopping 2"
                  className="w-full h-72 object-cover transform transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-xl font-semibold">Nouveautés de la saison</h3>
                    <p className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Découvrez les dernières arrivées
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                  alt="Inspiration shopping 3"
                  className="w-full h-72 object-cover transform transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-xl font-semibold">Meilleures ventes</h3>
                    <p className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Nos produits les plus populaires
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;