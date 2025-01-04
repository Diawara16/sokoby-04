import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { EmailMarketingTool } from "./marketing/EmailMarketingTool";
import { AutomationTool } from "./marketing/AutomationTool";
import { ABTestingTool } from "./marketing/ABTestingTool";
import { useMarketingOperations } from "./marketing/useMarketingOperations";

export const MarketingTools = () => {
  const { isLoading } = useMarketingOperations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Outils Marketing IA Avancés
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <EmailMarketingTool />
            <AutomationTool />
            <ABTestingTool />
          </div>
        )}
      </CardContent>
    </Card>
  );
};