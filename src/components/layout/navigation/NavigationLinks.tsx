
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  CreditCard, 
  Palette, 
  BookOpen, 
  MessageSquare,
  Bot,
  Wand2
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
    to: "/boutique-ia", 
    label: "Boutique IA",
    icon: <Bot className="h-4 w-4" />,
    highlight: true
  },
  { 
    to: "/creer-boutique-ia", 
    label: "Créer ma boutique IA",
    icon: <Wand2 className="h-4 w-4" />,
    highlight: true,
    featured: true
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
          className={`flex items-center gap-2 text-sm transition-colors duration-200 font-medium ${
            link.highlight 
              ? "text-primary hover:text-primary/90" 
              : "text-gray-600 hover:text-primary"
          } ${link.featured ? "font-semibold" : ""}`}
        >
          {link.icon}
          {link.label}
          {link.highlight && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
              IA
            </Badge>
          )}
        </Link>
      ))}
    </nav>
  );
}
