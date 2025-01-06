import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
}

const SubscriptionDetails = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour voir vos détails d'abonnement",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setSubscription(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'abonnement:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'abonnement",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Détails de l'abonnement</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de l'abonnement</CardTitle>
      </CardHeader>
      <CardContent>
        {subscription ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  subscription.status === "active" ? "bg-green-100 text-green-800" :
                  subscription.status === "canceled" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {subscription.status === "active" ? "Actif" :
                   subscription.status === "canceled" ? "Annulé" :
                   subscription.status}
                </span>
              </p>
            </div>
            
            {subscription.current_period_end && (
              <div>
                <p className="text-sm font-medium text-gray-500">Date de fin de période</p>
                <p className="mt-1">
                  {format(new Date(subscription.current_period_end), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-500">Date de création</p>
              <p className="mt-1">
                {format(new Date(subscription.created_at), "d MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Aucun abonnement actif
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionDetails;