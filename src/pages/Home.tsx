import { useLanguageContext } from "@/contexts/LanguageContext";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  isAuthenticated: boolean;
}

function Home({ isAuthenticated }: HomeProps) {
  const { currentLanguage } = useLanguageContext();
  const navigate = useNavigate();

  const handleCreateStore = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection 
        isAuthenticated={isAuthenticated}
        currentLanguage={currentLanguage}
      />
      
      <FeaturesSection currentLanguage={currentLanguage} />
      
      <CTASection 
        currentLanguage={currentLanguage}
        onCreateStore={handleCreateStore}
      />
    </div>
  );
}

export default Home;