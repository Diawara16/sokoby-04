import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface HomeProps {
  isAuthenticated: boolean;
}

function Home({ isAuthenticated }: HomeProps) {
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen bg-white">
      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;