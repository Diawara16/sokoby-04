import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationLinks } from "./NavigationLinks";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface MobileMenuProps {
  isAuthenticated: boolean;
}

export function MobileMenu({ isAuthenticated }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-lg text-gray-600 hover:text-gray-900 py-2"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/essai-gratuit">
                  <Button variant="ghost" className="w-full font-medium">
                    Se connecter
                  </Button>
                </Link>
                <Link to="/essai-gratuit">
                  <Button className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
                    Démarrer l'essai gratuit
                  </Button>
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-4">
                <NotificationBell />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}