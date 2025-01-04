import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApplicationCardHeader } from "./ApplicationCardHeader";
import { ApplicationCardFeatures } from "./ApplicationCardFeatures";
import { ApplicationCardPrice } from "./ApplicationCardPrice";
import type { LucideIcon } from "lucide-react";

interface ApplicationCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
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
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
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
    <Card className="relative transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <ApplicationCardHeader
          name={name}
          Icon={Icon}
          isConnected={isConnected}
          status={status}
        />
        <CardDescription className={isMobile ? "line-clamp-2" : "line-clamp-3"}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ApplicationCardFeatures features={features} />
        <ApplicationCardPrice price={price} />
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