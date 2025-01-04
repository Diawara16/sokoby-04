import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import ShoppingInspirationSection from "@/components/home/ShoppingInspirationSection";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { Footer } from "@/components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageContext();
  const { isAuthenticated } = useAuthAndProfile();

  const handleCreateStore = () => {
    navigate("/creer-boutique-ia");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tableau-de-bord");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection 
          isAuthenticated={isAuthenticated} 
          currentLanguage={currentLanguage} 
        />
        <div className="bg-gradient-to-b from-white to-gray-50">
          <FeaturesSection currentLanguage={currentLanguage} />
          <ShoppingInspirationSection />
          <CTASection 
            currentLanguage={currentLanguage}
            onCreateStore={handleCreateStore}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;