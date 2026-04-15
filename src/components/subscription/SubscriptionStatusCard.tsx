import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, Calendar, Shield, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useStoreSubscription } from "@/hooks/useStoreSubscription";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionStatusCardProps {
  storeId: string | null;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Actif", variant: "default" },
  trial: { label: "Essai gratuit (14 jours)", variant: "secondary" },
  canceling: { label: "Annulation en cours", variant: "outline" },
  expired: { label: "Expiré", variant: "destructive" },
  canceled: { label: "Annulé", variant: "outline" },
};

export const SubscriptionStatusCard = ({ storeId }: SubscriptionStatusCardProps) => {
  const { subscription, isLoading } = useStoreSubscription(storeId);
  const [isCanceling, setIsCanceling] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!subscription?.stripe_subscription_id) return;
    setIsCanceling(true);
    try {
      const { error } = await supabase.functions.invoke("cancel-store-subscription", {
        body: { storeId, stripeSubscriptionId: subscription.stripe_subscription_id },
      });
      if (error) throw error;
      toast({
        title: "Annulation programmée",
        description: "Votre abonnement restera actif jusqu'à la fin de la période en cours. Vos domaines et votre boutique ne seront pas affectés.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible d'annuler l'abonnement.",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

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
  const isCancelingStatus = subscription.status === "canceling";
  const isActive = subscription.status === "active" || isTrial;

  // Trial countdown
  const trialDaysRemaining = isTrial && subscription.end_date
    ? Math.max(0, differenceInDays(new Date(subscription.end_date), new Date()))
    : null;
  const trialProgress = trialDaysRemaining !== null ? ((14 - trialDaysRemaining) / 14) * 100 : null;

  // Grace period countdown
  const graceDaysRemaining = isCancelingStatus && subscription.end_date
    ? Math.max(0, differenceInDays(new Date(subscription.end_date), new Date()))
    : null;

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

        {isCancelingStatus && graceDaysRemaining !== null && (
          <div className="space-y-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              Annulation programmée
            </div>
            <p className="text-xs text-orange-700">
              Votre abonnement reste actif encore {graceDaysRemaining} jour{graceDaysRemaining > 1 ? "s" : ""}.
              Vos domaines et votre boutique resteront pleinement fonctionnels.
              Après cette date, seules les limitations de fonctionnalités s'appliqueront.
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

        {subscription.renewal_date && !isCancelingStatus && (
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

        {subscription.end_date && isCancelingStatus && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Fin d'accès</span>
            <span className="text-sm">
              {format(new Date(subscription.end_date), "d MMMM yyyy", { locale: fr })}
            </span>
          </div>
        )}

        {/* Cancel button — only for active/trial, not already canceling */}
        {isActive && subscription.stripe_subscription_id && (
          <div className="pt-2 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" disabled={isCanceling}>
                  {isCanceling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Annuler l'abonnement
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Annuler votre abonnement ?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>Votre abonnement restera actif jusqu'à la fin de la période en cours.</p>
                    <p className="font-medium">Ce qui ne changera PAS :</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Votre boutique reste en ligne</li>
                      <li>Vos domaines restent actifs et fonctionnels</li>
                      <li>Aucune donnée ne sera supprimée</li>
                    </ul>
                    <p className="text-sm">Après expiration, seules les limitations de fonctionnalités du plan gratuit s'appliqueront.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Garder mon abonnement</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                    Confirmer l'annulation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
