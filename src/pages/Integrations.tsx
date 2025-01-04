import { SocialPlatformIntegration } from "@/components/integrations/SocialPlatformIntegration";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const Integrations = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Intégrations</h2>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Plateformes sociales</CardTitle>
          </CardHeader>
          <SocialPlatformIntegration />
        </Card>
      </div>
    </div>
  );
};

export default Integrations;