import { Link } from "react-router-dom";
import { Info, HelpCircle, Book, Phone, Palette, CreditCard } from "lucide-react";

interface QuickLinksProps {
  t: any;
}

export const QuickLinks = ({ t }: QuickLinksProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t.footer.quickLinks}</h3>
      <ul className="space-y-2">
        <li>
          <Link 
            to="/plan-tarifaire" 
            className="hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            {t.footer.pricing}
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            className="hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            {t.footer.contact}
          </Link>
        </li>
        <li>
          <Link 
            to="/themes" 
            className="hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            {t.footer.themes}
          </Link>
        </li>
        <li>
          <Link 
            to="/guides" 
            className="hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            <Book className="h-4 w-4" />
            {t.footer.guidesAndTutorials}
          </Link>
        </li>
        <li>
          <Link 
            to="/faq" 
            className="hover:text-gray-300 transition-colors flex items-center gap-2 group"
          >
            <HelpCircle className="h-4 w-4 group-hover:animate-bounce" />
            {t.footer.faq}
            <span className="text-xs text-red-300 group-hover:text-red-200">
              (Nouveau !)
            </span>
          </Link>
        </li>
        <li>
          <Link 
            to="/qui-sommes-nous" 
            className="hover:text-gray-300 transition-colors flex items-center gap-2 group"
          >
            <Info className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            {t.footer.about}
          </Link>
        </li>
      </ul>
    </div>
  );
};