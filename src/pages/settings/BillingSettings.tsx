import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Subscription {
  status: string;
  current_period_end: string | null;
}

const BillingSettings = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading subscription:', error);
        return;
      }

      setSubscription(data);
    };

    loadSubscription();
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Facturation</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Statut de l'abonnement</h3>
            <p className="text-sm text-muted-foreground">
              {subscription?.status === 'active' 
                ? "Votre abonnement est actif"
                : "Vous n'avez pas d'abonnement actif"}
            </p>
            {subscription?.current_period_end && (
              <p className="text-sm text-muted-foreground">
                Prochain renouvellement : {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button onClick={handleManageSubscription}>
            Gérer l'abonnement
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BillingSettings;