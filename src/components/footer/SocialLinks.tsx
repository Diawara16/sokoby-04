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
        <a 
          href="https://facebook.com/sokoby" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
        >
          <Facebook className="h-6 w-6" />
        </a>
        <a 
          href="https://twitter.com/sokoby" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
        >
          <Twitter className="h-6 w-6" />
        </a>
        <a 
          href="https://instagram.com/sokoby" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
        >
          <Instagram className="h-6 w-6" />
        </a>
        <a 
          href="https://linkedin.com/company/sokoby" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
        >
          <Linkedin className="h-6 w-6" />
        </a>
        <a 
          href="https://tiktok.com/@sokoby" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </a>
        <a 
          href="https://pinterest.com/sokoby" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.44l1.4-5.96s-.35-.72-.35-1.78c0-1.67.96-2.92 2.17-2.92 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.57-1 4-.28 1.2.6 2.17 1.78 2.17 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5-4.88-3.41 0-5.41 2.55-5.41 5.18 0 1.03.39 2.13.88 2.73.1.11.11.21.08.32l-.33 1.32c-.05.22-.17.27-.4.16-1.5-.7-2.43-2.89-2.43-4.65 0-3.78 2.75-7.26 7.92-7.26 4.17 0 7.4 2.97 7.4 6.93 0 4.14-2.6 7.46-6.22 7.46-1.21 0-2.36-.63-2.75-1.37l-.75 2.85c-.27 1.04-1 2.35-1.49 3.15A12 12 0 1 0 12 0z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};