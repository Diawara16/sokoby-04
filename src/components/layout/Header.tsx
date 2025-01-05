import { Link } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { AuthButtons } from "./navigation/AuthButtons";
import { MobileMenu } from "./navigation/MobileMenu";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a23d77a2-5fb5-4b8d-b354-605dc6969483.png" 
              alt="Sokoby" 
              className="h-14 w-auto"
              width="140"
              height="56"
            />
          </Link>
          <NavigationLinks />
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <NotificationBell />
          ) : (
            <AuthButtons />
          )}
        </div>

        <MobileMenu isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}