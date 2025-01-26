import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { useNavigate } from "react-router-dom";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import ShoppingInspirationSection from "@/components/home/ShoppingInspirationSection";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthAndProfile();
  const currentLanguage = "fr"; // Langue par défaut

  const handleCreateStore = () => {
    navigate('/essai-gratuit');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />
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
      <Footer />
    </div>
  );
}