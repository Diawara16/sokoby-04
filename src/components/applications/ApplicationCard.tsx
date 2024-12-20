import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ApplicationCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

export const ApplicationCard = ({
  name,
  description,
  icon: Icon,
  isConnected,
  onConnect,
  onDisconnect,
  isLoading
}: ApplicationCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle>{name}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button 
          onClick={() => isConnected ? onDisconnect() : onConnect()}
          variant={isConnected ? "destructive" : "outline"}
          className="w-full"
          disabled={isLoading}
        >
          {isConnected ? "Déconnecter" : "Connecter"}
        </Button>
      </CardContent>
    </Card>
  );
};