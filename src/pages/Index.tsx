import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { translations } from "@/translations";
import { Navigation } from "@/components/home/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import ShoppingInspirationSection from "@/components/home/ShoppingInspirationSection";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('currentLanguage') || 'fr';
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const t = translations[currentLanguage as keyof typeof translations];

  if (!t?.navigation?.home || !t?.cta?.button) {
    console.error("Translation missing for required keys");
    return null;
  }

  // Données structurées enrichies pour Schema.org
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sokoby",
    "description": "Plateforme de création de boutique en ligne",
    "url": "https://sokoby.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sokoby.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sokoby",
      "logo": {
        "@type": "ImageObject",
        "url": "/lovable-uploads/e423a6d8-87e5-4ef9-af43-7e96b44fd685.png"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0",
      "highPrice": "49.99",
      "offerCount": "3"
    }
  };

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <title>Sokoby - Créez votre boutique en ligne en quelques clics</title>
        <meta name="description" content="Sokoby vous permet de créer et gérer facilement votre boutique en ligne. Commencez gratuitement et développez votre business e-commerce dès aujourd'hui." />
        <meta name="keywords" content="e-commerce, boutique en ligne, création site web, vente en ligne, solution e-commerce, marketplace" />
        <meta name="author" content="Sokoby" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="google" content="nositelinkssearchbox" />
        <meta name="google" content="notranslate" />
        <link rel="canonical" href="https://sokoby.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sokoby" />
        <meta property="og:locale" content={currentLanguage} />
        <meta property="og:url" content="https://sokoby.com" />
        <meta property="og:title" content="Sokoby - Plateforme de création de boutique en ligne" />
        <meta property="og:description" content="Créez votre boutique en ligne professionnelle en quelques minutes avec Sokoby. Solution complète d'e-commerce." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sokoby" />
        <meta name="twitter:creator" content="@sokoby" />
        <meta name="twitter:title" content="Sokoby - Créez votre boutique en ligne" />
        <meta name="twitter:description" content="Solution complète pour créer et gérer votre boutique en ligne. Commencez gratuitement." />
        <meta name="twitter:image" content="/og-image.png" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="border-b bg-white shadow-sm sticky top-0 z-50" role="banner">
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
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
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