import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Logo } from "./navigation/Logo";
import { MobileNav } from "./navigation/MobileNav";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - visible sur tous les écrans */}
          <Logo />

          {/* Navigation - visible sur desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/pricing">
              <Button variant="ghost">{t.navigation.pricing}</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">{t.navigation.about}</Button>
            </Link>
          </div>

          {/* Boutons d'authentification - visible sur desktop */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="font-medium"
                >
                  {t.auth.login}
                </Button>
                <Link to="/register">
                  <Button className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
                    {t.auth.startFreeTrial}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}