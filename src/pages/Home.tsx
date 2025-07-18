
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { AIStoreSection } from "@/components/home/AIStoreSection";
import { ModelComparisonSection } from "@/components/home/ModelComparisonSection";
import { PricingSection } from "@/components/home/PricingSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AIStoreSection />
      <ModelComparisonSection />
      <PricingSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </div>
  );
}
