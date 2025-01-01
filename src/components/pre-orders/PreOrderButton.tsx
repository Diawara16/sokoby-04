import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Clock } from "lucide-react";

export function PreOrderButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePreOrder = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("pre_orders")
        .insert({
          product_id: productId,
          status: "pending",
          estimated_arrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // +14 days
        });

      if (error) throw error;

      toast({
        title: "Précommande effectuée",
        description: "Vous serez notifié lorsque le produit sera disponible",
      });
    } catch (error) {
      console.error("Erreur lors de la précommande:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer la précommande",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePreOrder}
      disabled={isLoading}
      variant="secondary"
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Traitement en cours...
        </>
      ) : (
        <>
          <Clock className="mr-2 h-4 w-4" />
          Précommander
        </>
      )}
    </Button>
  );
}