import { Globe, Mail, FileText, Facebook, Twitter, Instagram, CreditCard, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' }
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Première colonne */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="flex items-center hover:text-red-400 transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link to="/conditions" className="flex items-center hover:text-red-400 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="flex items-center hover:text-red-400 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Guides & Tutoriels
                </Link>
              </li>
            </ul>
          </div>

          {/* Deuxième colonne - Réseaux sociaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="grid grid-cols-3 gap-4">
              <a href="#" className="hover:text-red-400 transition-colors flex flex-col items-center" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
                <span className="text-xs mt-1">Facebook</span>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors flex flex-col items-center" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
                <span className="text-xs mt-1">Twitter</span>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors flex flex-col items-center" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
                <span className="text-xs mt-1">Instagram</span>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors flex flex-col items-center" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
                <span className="text-xs mt-1">LinkedIn</span>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors flex flex-col items-center" aria-label="YouTube">
                <Youtube className="h-6 w-6" />
                <span className="text-xs mt-1">YouTube</span>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors flex flex-col items-center" aria-label="Pinterest">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 0 0-4.373 23.178c-.01-.937-.002-2.057.235-3.074.262-1.105 1.719-7.055 1.719-7.055s-.433-.879-.433-2.178c0-2.037 1.182-3.559 2.652-3.559 1.25 0 1.854.938 1.854 2.066 0 1.258-.801 3.137-1.216 4.885-.346 1.461.734 2.653 2.174 2.653 2.609 0 4.367-3.352 4.367-7.323 0-3.018-2.031-5.278-5.724-5.278-4.168 0-6.774 3.116-6.774 6.594 0 1.199.345 2.045.885 2.697.248.293.283.411.193.744-.063.245-.213.838-.273 1.074-.09.34-.365.461-.672.336-1.877-.768-2.754-2.83-2.754-5.15 0-3.83 3.227-8.42 9.627-8.42 5.142 0 8.527 3.723 8.527 7.722 0 5.293-2.941 9.243-7.273 9.243-1.455 0-2.822-.788-3.287-1.682l-.894 3.556c-.323 1.241-1.205 2.789-1.792 3.734A12 12 0 1 0 12 0z"/>
                </svg>
                <span className="text-xs mt-1">Pinterest</span>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors flex flex-col items-center" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="text-xs mt-1">TikTok</span>
              </a>
            </div>
          </div>

          {/* Troisième colonne */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Votre email" 
                className="bg-gray-800 border-gray-700"
              />
              <Button variant="secondary">S'inscrire</Button>
            </div>
          </div>

          {/* Quatrième colonne */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center hover:text-red-400 transition-colors">
                  <Globe className="h-4 w-4 mr-2" />
                  Changer de langue
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code}>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Modes de paiement acceptés</h3>
              <div className="flex space-x-2">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>

            <div className="text-sm text-gray-400">
              <Link to="/legal" className="hover:text-red-400 transition-colors">
                Mentions légales
              </Link>
              {" | "}
              <Link to="/accessibility" className="hover:text-red-400 transition-colors">
                Accessibilité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;