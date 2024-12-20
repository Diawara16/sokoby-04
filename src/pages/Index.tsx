import { AuthForm } from "@/components/auth/AuthForm";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, ShoppingBag, BarChart3, Globe2, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { translations } from "@/translations";
import { toast } from "sonner";

const features = [
  {
    icon: ShoppingBag,
  },
  {
    icon: BarChart3,
  },
  {
    icon: Globe2,
  },
];

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const handleCreateStore = () => {
    navigate('/onboarding');
  };

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    toast.success(`La langue a été changée en ${languages.find(lang => lang.code === langCode)?.name}`);
  };

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>

          <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg shadow-sm">
            <Languages className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              Langue:
            </span>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLanguage === lang.code ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`min-w-[40px] transition-colors ${
                    currentLanguage === lang.code 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/20"
                  }`}
                >
                  {lang.code.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
                {t.hero.title}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-100">
                {t.hero.subtitle}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              {isAuthenticated ? <ProfileForm /> : <AuthForm />}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
            {t.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 card-hover">
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.features.items[index].title}</h3>
                <p className="text-gray-600">{t.features.items[index].description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            {t.cta.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t.cta.subtitle}
          </p>
          <Button 
            size="lg" 
            className="bg-primary-700 text-white hover:bg-primary-800"
            onClick={handleCreateStore}
          >
            {t.cta.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Language Selector Footer */}
      <footer className="py-6 bg-gray-50 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Multilingue</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`text-sm transition-colors ${
                    currentLanguage === lang.code
                      ? 'text-primary-600 font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
