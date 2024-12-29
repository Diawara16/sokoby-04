import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  created_at: string;
  description: string | null;
}

export const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log("Fetching payment history...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found");
          setError("Vous devez être connecté pour voir votre historique de paiements");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("payment_history")
          .select("*")
          .eq('user_id', user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching payments:", fetchError);
          setError("Erreur lors du chargement de l'historique des paiements");
          toast({
            title: "Erreur",
            description: "Impossible de charger l'historique des paiements",
            variant: "destructive",
          });
          throw fetchError;
        }

        console.log("Payments fetched successfully:", data);
        setPayments(data || []);
      } catch (error) {
        console.error("Error in payment history:", error);
        setError("Une erreur est survenue lors du chargement de l'historique");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [toast]);

  if (error) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Historique des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucun historique de paiement disponible
          </p>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {payment.description || "Paiement"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(payment.created_at), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {payment.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount.toFixed(2)} €</p>
                  {payment.payment_method && (
                    <p className="text-sm text-muted-foreground">
                      {payment.payment_method}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};