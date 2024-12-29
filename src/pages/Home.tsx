import { HeroSection } from "@/components/home/HeroSection";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface HomeProps {
  isAuthenticated: boolean;
}

const Home = ({ isAuthenticated }: HomeProps) => {
  const { currentLanguage } = useLanguageContext();

  return (
    <div className="min-h-full w-full">
      <HeroSection isAuthenticated={isAuthenticated} currentLanguage={currentLanguage} />
    </div>
  );
};

export default Home;