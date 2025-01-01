import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Store } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface MarketplaceCardProps {
  name: string;
  description: string;
  status: string;
  onConnect: () => void;
  isLoading?: boolean;
}

export const MarketplaceCard = ({ 
  name, 
  description, 
  status, 
  onConnect,
  isLoading 
}: MarketplaceCardProps) => {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await onConnect();
      toast({
        title: "Connexion réussie",
        description: `Votre boutique a été connectée à ${name}`,
      });
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à la marketplace",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        {status === 'connected' ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Store className="h-4 w-4" />
            <span>Connecté</span>
          </div>
        ) : (
          <Button 
            onClick={handleConnect}
            disabled={connecting || isLoading}
            className="w-full"
          >
            {connecting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            )}
            Connecter {name}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};