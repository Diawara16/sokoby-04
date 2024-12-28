import { Link } from "react-router-dom";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/e423a6d8-87e5-4ef9-af43-7e96b44fd685.png" 
                alt="Logo" 
                className="h-14 w-auto"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/plan-tarifaire" className="text-gray-900 hover:text-red-600">
              {t.navigation.pricing}
            </Link>
            <Link to="/contact" className="text-gray-900 hover:text-red-600">
              {t.navigation.contact}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/essai-gratuit"
                  className="text-gray-900 hover:text-red-600"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Link to="/essai-gratuit">
                    Start free trial
                  </Link>
                </Button>
              </>
            ) : (
              <Link
                to="/profil"
                className="text-gray-900 hover:text-red-600"
              >
                {t.navigation.profile}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}