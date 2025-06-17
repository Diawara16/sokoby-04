
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Translation } from "@/types/translations";

export function AuthButtons() {
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage] as Translation;

  console.log("Auth buttons rendering, language:", currentLanguage, "current path:", window.location.pathname);

  // Utilisons la route /connexion qui est plus française
  const loginPath = "/connexion";
  const registerPath = "/inscription";

  return (
    <div className="flex items-center gap-3">
      <Link to={loginPath}>
        <Button variant="ghost" className="font-medium">
          {t.auth.login}
        </Button>
      </Link>
      <Link to={registerPath}>
        <Button className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
          {t.auth.startFreeTrial}
        </Button>
      </Link>
    </div>
  );
}
