import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, Calendar, Shield, Clock } from "lucide-react";
import { useStoreSubscription } from "@/hooks/useStoreSubscription";
import { Loader2 } from "lucide-react";

interface SubscriptionStatusCardProps {
  storeId: string | null;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Actif", variant: "default" },
  trial: { label: "Essai gratuit (14 jours)", variant: "secondary" },
  expired: { label: "Expiré", variant: "destructive" },
  canceled: { label: "Annulé", variant: "outline" },
};

export const SubscriptionStatusCard = ({ storeId }: SubscriptionStatusCardProps) => {
  const { subscription, isLoading } = useStoreSubscription(storeId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Abonnement boutique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun abonnement actif. Choisissez un plan pour débloquer toutes les fonctionnalités.
          </p>
        </CardContent>
      </Card>
    );
  }

  const plan = subscription.plans;
  const statusInfo = statusLabels[subscription.status] || statusLabels.active;
  const isTrial = subscription.status === "trial";

  // Trial countdown
  const trialDaysRemaining = isTrial && subscription.end_date
    ? Math.max(0, differenceInDays(new Date(subscription.end_date), new Date()))
    : null;
  const trialProgress = trialDaysRemaining !== null ? ((14 - trialDaysRemaining) / 14) * 100 : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Abonnement boutique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Plan</span>
          <span className="font-semibold">{plan?.name || "—"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Statut</span>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        {isTrial && trialDaysRemaining !== null && trialProgress !== null && (
          <div className="space-y-2 p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Période d'essai
            </div>
            <Progress value={trialProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {trialDaysRemaining > 0
                ? `${trialDaysRemaining} jour${trialDaysRemaining > 1 ? "s" : ""} restant${trialDaysRemaining > 1 ? "s" : ""} — toutes les fonctionnalités sont débloquées. Aucune facturation pendant l'essai.`
                : "Période d'essai terminée — les limitations du plan s'appliquent"}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            Facturation
          </span>
          <span className="text-sm">
            {subscription.billing_cycle === "yearly" ? "Annuelle" : "Mensuelle"}
          </span>
        </div>

        {subscription.renewal_date && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {isTrial ? "Fin de l'essai" : "Prochain renouvellement"}
            </span>
            <span className="text-sm">
              {format(new Date(subscription.renewal_date), "d MMMM yyyy", { locale: fr })}
            </span>
          </div>
        )}

        {subscription.end_date && !isTrial && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Fin de période</span>
            <span className="text-sm">
              {format(new Date(subscription.end_date), "d MMMM yyyy", { locale: fr })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
