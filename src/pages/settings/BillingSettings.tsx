import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, CreditCard } from "lucide-react";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('create-billing-portal-session', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au portail de facturation",
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
        <h1 className="text-2xl font-bold mb-2">Facturation</h1>
        <p className="text-muted-foreground">
          Gérez votre abonnement et consultez l'historique de vos paiements
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Cycle de facturation</h3>
            {subscription ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {subscription.status === 'active' ? 'Abonnement actif' : 'Abonnement inactif'}
                    </p>
                    {subscription.current_period_end && (
                      <p className="text-sm text-muted-foreground">
                        Prochaine facturation le {formatDate(subscription.current_period_end)}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Client depuis le {formatDate(subscription.created_at)}
                    </p>
                  </div>
                </div>
                <Button onClick={handleManageSubscription}>
                  Gérer l'abonnement
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas d'abonnement actif
                </p>
                <Button onClick={handleManageSubscription}>
                  Souscrire à un abonnement
                </Button>
              </div>
            )}
          </div>

          <Separator />

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