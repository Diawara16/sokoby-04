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

          {/* Deuxième colonne */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="YouTube">
                <Youtube className="h-6 w-6" />
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