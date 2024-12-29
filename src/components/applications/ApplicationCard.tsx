import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span>{name}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {isConnected ? "Application connectée" : "Application non connectée"}
        </p>
        {price && (
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {price.monthly}€/mois
              {price.annual && (
                <span className="text-xs text-muted-foreground ml-2">
                  ou {price.annual}€/an
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Disponible avec le plan Pro (19€/mois) ou Entreprise (49€/mois)
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
          className="w-full"
        >
          {isConnected ? "Déconnecter" : "Connecter"}
        </Button>
      </CardFooter>
    </Card>
  );
}