
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Logo } from "./navigation/Logo";
import { MobileNav } from "./navigation/MobileNav";
import { Search, User } from "lucide-react";
import { Translation } from "@/types/translations";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage] as Translation;

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation principale - visible sur desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
              {t.navigation.pricing}
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              {t.navigation.about}
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              {t.navigation.contact}
            </Link>
          </nav>

          {/* Actions - visible sur desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {!isAuthenticated ? (
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
            ) : (
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <MobileNav isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </header>
  );
}
