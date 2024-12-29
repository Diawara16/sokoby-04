import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

interface SocialLinksProps {
  t: any;
}

export const SocialLinks = ({ t }: SocialLinksProps) => {
  // Vérification que les traductions nécessaires existent et sont des chaînes
  if (!t?.footer?.followUs || !t?.footer?.socialMedia ||
      typeof t.footer.followUs !== 'string' ||
      typeof t.footer.socialMedia !== 'string') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{t.footer.followUs}</h3>
      <p className="text-sm text-gray-300 mb-4">{t.footer.socialMedia}</p>
      <div className="flex space-x-4">
        <Link to="#" className="hover:text-red-400 transition-colors">
          <Facebook className="h-6 w-6" />
        </Link>
        <Link to="#" className="hover:text-red-400 transition-colors">
          <Twitter className="h-6 w-6" />
        </Link>
        <Link to="#" className="hover:text-red-400 transition-colors">
          <Instagram className="h-6 w-6" />
        </Link>
        <Link to="#" className="hover:text-red-400 transition-colors">
          <Linkedin className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};