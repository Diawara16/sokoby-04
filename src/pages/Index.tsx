import { AuthForm } from "@/components/auth/AuthForm";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ArrowRight, ShoppingBag, BarChart3, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { translations } from "@/translations";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('currentLanguage') || 'fr';
  });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentLanguage') {
        setCurrentLanguage(event.newValue || 'fr');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCreateStore = () => {
    navigate('/onboarding');
  };

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/e423a6d8-87e5-4ef9-af43-7e96b44fd685.png" 
                  alt="Sokoby" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <Link to="/domicile" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
                    {t.navigation.home}
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/environ" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
                    {t.navigation.about}
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/services" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
                    {t.navigation.services}
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/themes" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
                    {t.navigation.themes}
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/plan-tarifaire" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
                    {t.navigation.pricing}
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className={navigationMenuTriggerStyle() + " text-gray-700 hover:text-red-600"}>
                    {t.navigation.contact}
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button 
              variant="default" 
              className="bg-red-600 hover:bg-red-700 transition-colors duration-200"
              onClick={handleCreateStore}
            >
              {t.cta.button}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              {isAuthenticated ? <ProfileForm /> : <AuthForm />}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-900">
            {t.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border-none bg-gray-50">
                <feature.icon className="h-12 w-12 text-red-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{t.features.items[index].title}</h3>
                <p className="text-gray-600 leading-relaxed">{t.features.items[index].description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            {t.cta.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t.cta.subtitle}
          </p>
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
            onClick={handleCreateStore}
          >
            {t.cta.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;