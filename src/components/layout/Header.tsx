import { NavigationLinks } from "./navigation/NavigationLinks";
import { AuthButtons } from "./navigation/AuthButtons";
import { Logo } from "./navigation/Logo";
import { MobileMenu } from "./navigation/MobileMenu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:block">
            <Logo />
          </div>
          <NavigationLinks />
          <div className="hidden md:flex items-center gap-4">
            <AuthButtons />
          </div>
          <div className="md:hidden flex items-center justify-between w-full gap-4">
            <Logo />
            <Link to="/register">
              <Button className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white">
                Démarrer l'essai gratuit
              </Button>
            </Link>
            <MobileMenu isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  );
}