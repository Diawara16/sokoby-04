import { Link } from "react-router-dom";
import { 
  Home, 
  CreditCard, 
  Palette, 
  BookOpen, 
  MessageSquare 
} from "lucide-react";

export const navigationLinks = [
  { 
    to: "/", 
    label: "Accueil",
    icon: <Home className="h-4 w-4" />
  },
  { 
    to: "/plan-tarifaire", 
    label: "Tarifs",
    icon: <CreditCard className="h-4 w-4" />
  },
  { 
    to: "/themes", 
    label: "Thèmes",
    icon: <Palette className="h-4 w-4" />
  },
  { 
    to: "/guides", 
    label: "Guides",
    icon: <BookOpen className="h-4 w-4" />
  },
  { 
    to: "/contact", 
    label: "Contact",
    icon: <MessageSquare className="h-4 w-4" />
  },
];

export function NavigationLinks() {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigationLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
}