import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useStoreSubscription } from "@/hooks/useStoreSubscription";

interface TrialBannerProps {
  storeId: string | null;
  compact?: boolean;
}

export const TrialBanner = ({ storeId, compact = false }: TrialBannerProps) => {
  const { subscription, isLoading } = useStoreSubscription(storeId);

  if (isLoading || !subscription || subscription.status !== "trial") return null;

  const planName = (subscription.plans as any)?.name || "Pro";
  const endDate = subscription.end_date;
  const daysRemaining = endDate
    ? Math.max(0, differenceInDays(new Date(endDate), new Date()))
    : 14;
  const trialProgress = ((14 - daysRemaining) / 14) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-primary">
          Essai {planName} — {daysRemaining}j restant{daysRemaining > 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">
            Essai gratuit de 14 jours — Plan {planName}
          </span>
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {daysRemaining} jour{daysRemaining > 1 ? "s" : ""} restant{daysRemaining > 1 ? "s" : ""}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Toutes les fonctionnalités sont débloquées
        </div>
      </div>
      <Progress value={trialProgress} className="h-1.5" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Aucune facturation pendant la période d'essai</span>
        {endDate && (
          <span>
            Se termine le {format(new Date(endDate), "d MMMM yyyy", { locale: fr })}
          </span>
        )}
      </div>
    </div>
  );
};
