import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, Calendar, Shield } from "lucide-react";
import { useStoreSubscription } from "@/hooks/useStoreSubscription";
import { Loader2 } from "lucide-react";

interface SubscriptionStatusCardProps {
  storeId: string | null;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Actif", variant: "default" },
  trial: { label: "Essai gratuit", variant: "secondary" },
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
              Prochain renouvellement
            </span>
            <span className="text-sm">
              {format(new Date(subscription.renewal_date), "d MMMM yyyy", { locale: fr })}
            </span>
          </div>
        )}

        {subscription.end_date && (
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
