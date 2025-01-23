import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Package, Loader2 } from "lucide-react";
import { useState } from "react";

interface ShippingIntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  provider: string;
}

export const ShippingIntegrationCard = ({ 
  name, 
  description, 
  icon,
  provider 
}: ShippingIntegrationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Non authentifié');
      }

      const { error } = await supabase
        .from('shipping_integrations')
        .insert({
          user_id: user.id,
          provider: provider.toLowerCase(),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Intégration initiée",
        description: `La connexion à ${name} a été initiée avec succès.`,
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au service de livraison.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button 
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Connecter {name}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};