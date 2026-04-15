import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DomainUpgradePromptProps {
  currentPlan: string;
  reason: "no_custom_domain" | "limit_reached";
  domainsUsed?: number;
  domainsAllowed?: number;
}

export const DomainUpgradePrompt = ({ currentPlan, reason, domainsUsed, domainsAllowed }: DomainUpgradePromptProps) => {
  const navigate = useNavigate();

  const planLabel = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <Crown className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {reason === "no_custom_domain" ? (
              <p>
                Votre plan <strong>{planLabel}</strong> ne permet pas l'utilisation de domaines personnalisés.
                Passez au plan <strong>Basic</strong> ou supérieur pour connecter votre propre domaine.
              </p>
            ) : (
              <p>
                Vous avez atteint la limite de domaines ({domainsUsed}/{domainsAllowed}) pour le plan <strong>{planLabel}</strong>.
                Passez à un plan supérieur pour connecter plus de domaines.
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => navigate("/tarifs")}
          >
            <Crown className="mr-2 h-4 w-4" />
            Voir les plans
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
