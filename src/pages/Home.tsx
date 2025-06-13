
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CompetitiveAdvantagesSection } from "@/components/home/CompetitiveAdvantagesSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { PricingComparisonSection } from "@/components/home/PricingComparisonSection";
import { CTASection } from "@/components/home/CTASection";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { isAuthenticated } = useAuthAndProfile();
  const navigate = useNavigate();
  const currentLanguage = "fr";

  const handleCreateStore = () => {
    if (isAuthenticated) {
      navigate("/creer-boutique-ia");
    } else {
      navigate("/essai-gratuit");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CompetitiveAdvantagesSection />
        <SocialProofSection />
        <PricingComparisonSection />
        <CTASection 
          currentLanguage={currentLanguage}
          onCreateStore={handleCreateStore}
        />
      </main>
      <Footer />
    </div>
  );
}
