import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import ShoppingInspirationSection from "@/components/home/ShoppingInspirationSection";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface HomeProps {
  isAuthenticated: boolean;
}

const Home = ({ isAuthenticated }: HomeProps) => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageContext();

  const handleCreateStore = () => {
    navigate("/creer-boutique-ia");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tableau-de-bord");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Prevent flash of content during redirect
  }

  return (
    <div className="space-y-20 pb-8">
      <HeroSection 
        isAuthenticated={isAuthenticated} 
        currentLanguage={currentLanguage} 
      />
      <FeaturesSection currentLanguage={currentLanguage} />
      <ShoppingInspirationSection />
      <CTASection 
        currentLanguage={currentLanguage}
        onCreateStore={handleCreateStore}
      />
    </div>
  );
};

export default Home;