import { socialPlatforms } from './config/platforms';
import { usePlatformIntegration } from './hooks/usePlatformIntegration';
import { PlatformCard } from './PlatformCard';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TwitterTest } from './TwitterTest';

export const SocialPlatformIntegration = () => {
  const { isLoading, handleIntegration, integrations, error } = usePlatformIntegration();
  const { toast } = useToast();

  const onIntegrate = async (platform: any) => {
    try {
      await handleIntegration(platform);
      toast({
        title: "Intégration initiée",
        description: `L'intégration avec ${platform.name} a été initiée avec succès.`,
      });
    } catch (error) {
      console.error("Erreur d'intégration:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'intégration. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Intégrations Sociales</CardTitle>
      </CardHeader>
      
      {error && (
        <Alert variant="destructive" className="mx-4 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 p-4 md:grid-cols-2">
        {socialPlatforms.map((platform) => (
          <PlatformCard
            key={platform.name}
            platform={platform}
            isLoading={isLoading[platform.name]}
            onIntegrate={() => onIntegrate(platform)}
            currentStatus={integrations?.[platform.name.toLowerCase()]?.status}
            integrationId={integrations?.[platform.name.toLowerCase()]?.id}
            productIds={[]}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <TwitterTest />
      </div>
    </Card>
  );
};