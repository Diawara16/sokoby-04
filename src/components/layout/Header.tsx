import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface HeaderProps {
  isAuthenticated: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-red-600">
          Shopifyra
        </Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link to="/profil">
                <Button variant="ghost">Mon profil</Button>
              </Link>
            </>
          ) : (
            <Link to="/plan-tarifaire">
              <Button>Commencer</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}