import { Badge } from "@/components/ui/badge";
import { Crown, Clock } from "lucide-react";

interface DomainPlanBadgeProps {
  currentPlan: string;
  domainsUsed: number;
  domainsAllowed: number;
  remainingDomains: number | null;
  isTrial?: boolean;
}

export const DomainPlanBadge = ({ currentPlan, domainsUsed, domainsAllowed, remainingDomains, isTrial = false }: DomainPlanBadgeProps) => {
  const planLabel = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  const isUnlimited = remainingDomains === null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
        <Crown className="h-3.5 w-3.5" />
        Plan {planLabel}
      </Badge>
      {isTrial && (
        <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
          <Clock className="h-3.5 w-3.5" />
          Essai actif
        </Badge>
      )}
      <span className="text-sm text-muted-foreground">
        {isUnlimited
          ? `${domainsUsed} domaine${domainsUsed !== 1 ? "s" : ""} connecté${domainsUsed !== 1 ? "s" : ""} (illimité)`
          : `${domainsUsed}/${domainsAllowed} domaine${domainsAllowed !== 1 ? "s" : ""} utilisé${domainsUsed !== 1 ? "s" : ""}`}
      </span>
    </div>
  );
};
