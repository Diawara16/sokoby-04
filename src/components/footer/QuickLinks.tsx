import { Link } from "react-router-dom";

export const QuickLinks = ({ t }: { t: any }) => {
  if (!t?.footer?.quickLinks || !t?.footer?.legalNotice || !t?.footer?.accessibility ||
      !t?.footer?.termsOfUse || !t?.footer?.support ||
      typeof t.footer.quickLinks !== 'string' ||
      typeof t.footer.legalNotice !== 'string' ||
      typeof t.footer.accessibility !== 'string' ||
      typeof t.footer.termsOfUse !== 'string' ||
      typeof t.footer.support !== 'string') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t.footer.quickLinks}</h3>
      <ul className="space-y-2">
        <li>
          <Link 
            to="/legal" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            {t.footer.legalNotice}
          </Link>
        </li>
        <li>
          <Link 
            to="/accessibility" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            {t.footer.accessibility}
          </Link>
        </li>
        <li>
          <Link 
            to="/conditions" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            {t.footer.termsOfUse}
          </Link>
        </li>
        <li>
          <Link 
            to="/support" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            {t.footer.support}
          </Link>
        </li>
      </ul>
    </div>
  );
};