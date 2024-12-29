import { Link } from "react-router-dom";

export const navigationLinks = [
  { to: "/", label: "Accueil" },
  { to: "/plan-tarifaire", label: "Tarifs" },
  { to: "/themes", label: "Thèmes" },
  { to: "/guides", label: "Guides" },
  { to: "/contact", label: "Contact" },
];

export function NavigationLinks() {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navigationLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}