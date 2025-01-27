import { NavigationLinks } from "./navigation/NavigationLinks";
import { AuthButtons } from "./navigation/AuthButtons";
import { Logo } from "./navigation/Logo";
import { MobileMenu } from "./navigation/MobileMenu";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <NavigationLinks />
          <div className="flex items-center gap-4">
            <AuthButtons />
            <MobileMenu isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  );
}