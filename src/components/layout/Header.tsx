import { Link } from "react-router-dom";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const { currentLanguage } = useLanguageContext();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const t = translations[currentLanguage as keyof typeof translations];

  const handleAuthClick = (signup: boolean) => {
    setIsSignUp(signup);
    setShowAuthForm(true);
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
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
            <Link to="/" className="text-gray-900 hover:text-red-600">
              Accueil
            </Link>
            <Link to="/a-propos" className="text-gray-900 hover:text-red-600">
              À propos
            </Link>
            <Link to="/services" className="text-gray-900 hover:text-red-600">
              Services
            </Link>
            <Link to="/themes" className="text-gray-900 hover:text-red-600">
              Thèmes
            </Link>
            <Link to="/plan-tarifaire" className="text-gray-900 hover:text-red-600">
              Tarifs
            </Link>
            <Link to="/contact" className="text-gray-900 hover:text-red-600">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => handleAuthClick(false)}
                  className="text-gray-900 hover:text-red-600"
                >
                  S'identifier
                </Button>
                <Button
                  onClick={() => handleAuthClick(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Démarrer l'essai gratuit
                </Button>
              </>
            ) : (
              <Link
                to="/profil"
                className="text-gray-900 hover:text-red-600"
              >
                Mon profil
              </Link>
            )}
          </div>
        </div>
      </div>

      {showAuthForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4">
              <AuthForm 
                defaultIsSignUp={isSignUp}
                onCancel={() => setShowAuthForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}