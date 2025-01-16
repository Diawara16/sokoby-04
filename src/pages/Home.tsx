import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { useNavigate } from "react-router-dom";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import ShoppingInspirationSection from "@/components/home/ShoppingInspirationSection";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthAndProfile();
  const currentLanguage = "fr"; // Langue par défaut

  const handleCreateStore = () => {
    navigate('/essai-gratuit');
  };

  return (
    <main className="flex-1">
      <HeroSection 
        isAuthenticated={isAuthenticated} 
        currentLanguage={currentLanguage}
      />
      <FeaturesSection 
        currentLanguage={currentLanguage}
      />
      <ShoppingInspirationSection />
      <CTASection 
        currentLanguage={currentLanguage}
        onCreateStore={handleCreateStore}
      />
    </main>
  );
}