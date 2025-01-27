import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Package } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationLinks } from "./NavigationLinks";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { pricingPlans } from "@/data/pricingData";

interface MobileMenuProps {
  isAuthenticated: boolean;
}

export function MobileMenu({ isAuthenticated }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col p-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 py-3 text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {link.icon}
                <span className="text-base font-medium">{link.label}</span>
              </Link>
            ))}
            
            <div className="mt-6 pt-6 border-t">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/suivi-commande">
                    <Button variant="outline" className="w-full font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Suivi de commande
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="w-full font-medium">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium">
                      Démarrer l'essai gratuit
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <NotificationBell />
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}