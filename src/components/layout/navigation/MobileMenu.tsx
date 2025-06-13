
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Bot, Wand2 } from "lucide-react";
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
          <Button variant="ghost" size="icon" className="relative">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
          <SheetHeader className="p-6 border-b">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/a23d77a2-5fb5-4b8d-b354-605dc6969483.png" 
                alt="Sokoby" 
                className="h-14 w-auto"
                width="140"
                height="56"
              />
            </Link>
          </SheetHeader>
          <div className="flex flex-col p-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 py-3 transition-colors duration-200 ${
                  link.highlight 
                    ? "text-primary hover:text-primary/90" 
                    : "text-gray-600 hover:text-primary"
                } ${link.featured ? "font-semibold" : ""}`}
              >
                {link.icon}
                <span className="text-base font-medium">{link.label}</span>
                {link.highlight && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                    IA
                  </Badge>
                )}
              </Link>
            ))}
            
            <div className="mt-6 pt-6 border-t">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/register">
                    <Button className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
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
