import { AuthForm } from "@/components/auth/AuthForm";
import { translations } from "@/translations";

interface HeroSectionProps {
  isAuthenticated: boolean;
  currentLanguage: string;
}

export const HeroSection = ({ isAuthenticated, currentLanguage }: HeroSectionProps) => {
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px]" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-red-100">
              {t.hero.subtitle}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            {!isAuthenticated && <AuthForm />}
          </div>
        </div>
      </div>
    </section>
  );
};