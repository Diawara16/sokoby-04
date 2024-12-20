import { AuthForm } from "@/components/auth/AuthForm";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-primary">Sokoby</span>
              </Link>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/domicile" className={navigationMenuTriggerStyle()}>
                    Domicile
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/environ" className={navigationMenuTriggerStyle()}>
                    Environ
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/services" className={navigationMenuTriggerStyle()}>
                    Services
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/themes" className={navigationMenuTriggerStyle()}>
                    Des Thèmes Étonnants
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/plan-tarifaire" className={navigationMenuTriggerStyle()}>
                    Plan Tarifaire
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className={navigationMenuTriggerStyle()}>
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button variant="default" className="bg-red-600 hover:bg-red-700">
              Démarrer
            </Button>
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
    </div>
  );
};

export default Index;
