import { socialPlatforms } from './config/platforms';
import { usePlatformIntegration } from './hooks/usePlatformIntegration';
import { PlatformCard } from './PlatformCard';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const SocialPlatformIntegration = () => {
  const { isLoading, handleIntegration, integrations, error } = usePlatformIntegration();

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
            onIntegrate={handleIntegration}
            currentStatus={integrations?.[platform.name.toLowerCase()]?.status}
          />
        ))}
      </div>
    </Card>
  );
};