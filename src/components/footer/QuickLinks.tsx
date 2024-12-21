import { Mail, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickLinksProps {
  t: any;
}

export const QuickLinks = ({ t }: QuickLinksProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h3>
      <ul className="space-y-2">
        <li>
          <Link to="/contact" className="flex items-center hover:text-red-400 transition-colors">
            <Mail className="h-4 w-4 mr-2" />
            {t.footer.contactUs}
          </Link>
        </li>
        <li>
          <Link to="/conditions" className="flex items-center hover:text-red-400 transition-colors">
            <FileText className="h-4 w-4 mr-2" />
            {t.footer.termsOfUse}
          </Link>
        </li>
        <li>
          <Link to="/guides" className="flex items-center hover:text-red-400 transition-colors">
            <FileText className="h-4 w-4 mr-2" />
            {t.footer.guidesAndTutorials}
          </Link>
        </li>
      </ul>
    </div>
  );
};