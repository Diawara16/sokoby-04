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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadSubscriptionAndPayments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Charger l'abonnement
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subError) {
        console.error('Error loading subscription:', subError);
        return;
      }

      setSubscription(subData);

      // Charger l'historique des paiements
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

    loadSubscriptionAndPayments();
  }, []);

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-billing-portal-session');
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error accessing billing portal:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'accéder au portail de facturation. Veuillez contacter le support.",
        variant: "destructive",
      });
    }
  };

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
                <Button onClick={handleManageSubscription} className="w-full">
                  Gérer l'abonnement (Annuler, Modifier)
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Vous serez redirigé vers Stripe pour gérer votre abonnement en toute sécurité
                </p>
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

      {/* Emergency Contact */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Besoin d'aide ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-orange-700">
            <p>Si vous rencontrez des problèmes pour annuler votre abonnement :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Contactez le support Stripe directement</li>
              <li>Envoyez un email à notre équipe support</li>
              <li>Le portail Stripe vous permet d'annuler immédiatement</li>
            </ul>
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