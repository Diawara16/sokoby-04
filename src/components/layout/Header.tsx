import { Link } from "react-router-dom";
import { MobileNav } from "./navigation/MobileNav";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { AuthButtons } from "./navigation/AuthButtons";
import { Logo } from "./navigation/Logo";
import { LanguageSelector } from "./navigation/LanguageSelector";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

export function Header() {
  const { isAuthenticated } = useAuthAndProfile();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <NavigationLinks />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <AuthButtons isAuthenticated={isAuthenticated} />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}