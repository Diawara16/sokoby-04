
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

export function AuthButtons() {
  const { currentLanguage } = useLanguageContext();
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="flex items-center gap-3">
      <Link to="/login">
        <Button variant="ghost" className="font-medium">
          {t.auth.login}
        </Button>
      </Link>
      <Link to="/register">
        <Button className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-medium">
          {t.auth.startFreeTrial}
        </Button>
      </Link>
    </div>
  );
}
