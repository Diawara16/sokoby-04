import { HeroSection } from "@/components/home/HeroSection";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { TextAnalysis } from "@/components/ai/TextAnalysis";

interface HomeProps {
  isAuthenticated: boolean;
}

const Home = ({ isAuthenticated }: HomeProps) => {
  const { currentLanguage } = useLanguageContext();

  return (
    <div className="min-h-screen">
      <HeroSection isAuthenticated={isAuthenticated} currentLanguage={currentLanguage} />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <TextAnalysis />
      </div>
    </div>
  );
};

export default Home;