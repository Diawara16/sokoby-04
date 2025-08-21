import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, CreditCard, AlertTriangle } from "lucide-react";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import { InvoiceHistory } from "@/components/subscription/InvoiceHistory";
import { ReportDoubleCharge } from "@/components/subscription/ReportDoubleCharge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Subscription {
  status: string;
  current_period_end: string | null;
  created_at: string;
}

interface PaymentHistory {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  payment_method: string;
}

const BillingSettings = () => {
  const { 
    subscription, 
    invoices, 
    cancelSubscription, 
    checkForDuplicateSubscription, 
    isLoading,
    refreshData 
  } = useSubscriptionManagement();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [hasDuplicateSubscription, setHasDuplicateSubscription] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPaymentHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Charger l'historique des paiements (legacy)
      const { data: payments, error: payError } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (payError) {
        console.error('Error loading payments:', payError);
        return;
      }

      setPaymentHistory(payments || []);
    };

    const checkDuplicates = async () => {
      const hasDuplicates = await checkForDuplicateSubscription();
      setHasDuplicateSubscription(hasDuplicates);
    };

    loadPaymentHistory();
    checkDuplicates();
    refreshData();
  }, [checkForDuplicateSubscription, refreshData]);

  const handleManageSubscription = cancelSubscription;

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Abonnement & Facturation</h1>
        <p className="text-muted-foreground">
          Gérez votre abonnement, annulez votre compte ou consultez votre historique de paiement
        </p>
      </div>

      {/* Duplicate Subscription Warning */}
      {hasDuplicateSubscription && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <span className="font-medium">Abonnements multiples détectés !</span> 
            <br />
            Vous avez plusieurs abonnements actifs. Contactez le support immédiatement pour éviter des charges supplémentaires.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnement actuel</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Statut:</span>
                <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                  {subscription.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              {subscription.current_period_end && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Fin du cycle:</span>
                  <span>{formatDate(subscription.current_period_end)}</span>
                </div>
              )}
              <div className="space-y-2">
                <Button onClick={handleManageSubscription} className="w-full" disabled={isLoading}>
                  {isLoading ? 'Ouverture...' : 'Gérer l\'abonnement (Annuler, Modifier)'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Vous serez redirigé vers Stripe pour gérer votre abonnement en toute sécurité
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">💡 Annulation simple et immédiate</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Votre annulation prend effet immédiatement. Aucun frais supplémentaire ne sera prélevé.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Aucun abonnement actif</p>
              <Button asChild>
                <a href="/plan-tarifaire">Choisir un plan</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Double Charge */}
      <ReportDoubleCharge />

      {/* Invoice History */}
      <InvoiceHistory invoices={invoices} />

      {/* Emergency Contact */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Besoin d'aide ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-orange-700">
            <p>Si vous rencontrez des problèmes pour annuler votre abonnement :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Le portail Stripe permet l'annulation immédiate (recommandé)</li>
              <li>Contactez le support Stripe directement</li>
              <li>Envoyez un email à notre équipe support</li>
            </ul>
            <div className="bg-orange-100 border border-orange-300 rounded p-3">
              <p className="font-medium text-orange-800">🔒 Garantie de remboursement</p>
              <p className="text-xs text-orange-700 mt-1">
                Toute facturation erronée sera remboursée sous 24h. Aucune question posée.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Historique des paiements</h3>
            {paymentHistory.length > 0 ? (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-start gap-4">
                    <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {payment.amount.toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.created_at)}
                          </p>
                        </div>
                        <span className={`text-sm ${
                          payment.status === 'succeeded' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.status === 'succeeded' ? 'Payé' : 'Échoué'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {payment.payment_method}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Aucun historique de paiement disponible
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BillingSettings;