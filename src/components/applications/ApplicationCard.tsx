import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface ApplicationCardProps {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
  price?: {
    monthly: number;
    annual?: number;
  };
  features?: string[];
  status?: 'active' | 'pending' | 'error';
}

export function ApplicationCard({
  name,
  description,
  icon: Icon,
  isConnected,
  onConnect,
  onDisconnect,
  isLoading,
  price,
  features,
  status = 'active'
}: ApplicationCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'error':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <span>{name}</span>
          </CardTitle>
          {isConnected && (
            <Badge variant="secondary" className={getStatusColor()}>
              {status === 'active' ? 'Connecté' : status === 'pending' ? 'En attente' : 'Erreur'}
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {features && features.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Fonctionnalités :</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {price && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {price.monthly}€/mois
                {price.annual && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ou {price.annual}€/an
                  </span>
                )}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Disponible avec le plan Pro (19€/mois) ou Entreprise (49€/mois)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Chargement...</span>
            </div>
          ) : (
            isConnected ? "Déconnecter" : "Connecter"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}