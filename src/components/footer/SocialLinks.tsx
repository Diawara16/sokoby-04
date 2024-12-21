import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

interface SocialLinksProps {
  t: any;
}

export const SocialLinks = ({ t }: SocialLinksProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{t.footer.followUs}</h3>
      <div className="grid grid-cols-3 gap-4">
        <a 
          href="#" 
          className="hover:text-red-400 transition-colors flex flex-col items-center" 
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="h-6 w-6" />
          <span className="text-xs mt-1">Facebook</span>
        </a>
        <a 
          href="#" 
          className="hover:text-red-400 transition-colors flex flex-col items-center" 
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-6 w-6" />
          <span className="text-xs mt-1">Twitter</span>
        </a>
        <a 
          href="#" 
          className="hover:text-red-400 transition-colors flex flex-col items-center" 
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="h-6 w-6" />
          <span className="text-xs mt-1">Instagram</span>
        </a>
        <a 
          href="#" 
          className="hover:text-red-400 transition-colors flex flex-col items-center" 
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="h-6 w-6" />
          <span className="text-xs mt-1">LinkedIn</span>
        </a>
        <a 
          href="#" 
          className="hover:text-red-400 transition-colors flex flex-col items-center" 
          aria-label="YouTube"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube className="h-6 w-6" />
          <span className="text-xs mt-1">YouTube</span>
        </a>
        <a 
          href="#" 
          className="hover:text-red-400 transition-colors flex flex-col items-center" 
          aria-label="Pinterest"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0a12 12 0 0 0-4.373 23.178c-.01-.937-.002-2.057.235-3.074.262-1.105 1.719-7.055 1.719-7.055s-.433-.879-.433-2.178c0-2.037 1.182-3.559 2.652-3.559 1.25 0 1.854.938 1.854 2.066 0 1.258-.801 3.137-1.216 4.885-.346 1.461.734 2.653 2.174 2.653 2.609 0 4.367-3.352 4.367-7.323 0-3.018-2.031-5.278-5.724-5.278-4.168 0-6.774 3.116-6.774 6.594 0 1.199.345 2.045.885 2.697.248.293.283.411.193.744-.063.245-.213.838-.273 1.074-.09.34-.365.461-.672.336-1.877-.768-2.754-2.83-2.754-5.15 0-3.83 3.227-8.42 9.627-8.42 5.142 0 8.527 3.723 8.527 7.722 0 5.293-2.941 9.243-7.273 9.243-1.455 0-2.822-.788-3.287-1.682l-.894 3.556c-.323 1.241-1.205 2.789-1.792 3.734A12 12 0 1 0 12 0z"/>
          </svg>
          <span className="text-xs mt-1">Pinterest</span>
        </a>
        <a 
          href="#" 
          className="hover:text-red-400 transition-colors flex flex-col items-center" 
          aria-label="TikTok"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span className="text-xs mt-1">TikTok</span>
        </a>
      </div>
    </div>
  );
};