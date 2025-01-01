import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

interface SocialLinksProps {
  t: any;
}

export const SocialLinks = ({ t }: SocialLinksProps) => {
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
          href="https://www.facebook.com/sokobyonline/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
          aria-label="Facebook"
        >
          <Facebook className="h-6 w-6" />
        </a>
        <a 
          href="https://x.com/sokobyonline/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
          aria-label="X (Twitter)"
        >
          <Twitter className="h-6 w-6" />
        </a>
        <a 
          href="https://www.instagram.com/sokobyonline" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="h-6 w-6" />
        </a>
        <a 
          href="https://www.linkedin.com/company/sokoby/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-6 w-6" />
        </a>
        <a 
          href="https://www.youtube.com/@Sokoby/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
          aria-label="YouTube"
        >
          <Youtube className="h-6 w-6" />
        </a>
        <a 
          href="https://www.tiktok.com/@sokobyonline" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
          aria-label="TikTok"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-6 w-6"
          >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        </a>
        <a 
          href="https://www.pinterest.com/sokobyonline/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-red-400 transition-colors"
          aria-label="Pinterest"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-6 w-6"
          >
            <path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
            <path d="M12 4v16" />
            <path d="M4 12h16" />
          </svg>
        </a>
      </div>
    </div>
  );
};