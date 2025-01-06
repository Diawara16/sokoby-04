import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "./hooks/useStoreSettings";
import { DomainAlert } from "./DomainAlert";
import { StoreSettingsForm } from "./StoreSettingsForm";
import { ErrorDisplay } from "../store-creator/ErrorDisplay";
import { Loader2 } from "lucide-react";

interface StoreSettingsProps {
  showDomainOnly?: boolean;
}

export const StoreSettings = ({ showDomainOnly = false }: StoreSettingsProps) => {
  const { settings, setSettings, isLoading, error, handleSave, reloadSettings } = useStoreSettings();

  const handleFieldChange = (field: string, value: string) => {
    setSettings(prev => prev ? {...prev, [field]: value} : null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorDisplay error={error} />
        <Button onClick={reloadSettings} variant="outline" className="w-full">
          Réessayer
        </Button>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8 space-y-4">
        <p className="text-muted-foreground">
          Aucun paramètre trouvé.
        </p>
        <Button onClick={reloadSettings} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  if (showDomainOnly) {
    return <DomainAlert domainName={settings.domain_name} />;
  }

  return (
    <div className="space-y-6">
      <DomainAlert domainName={settings.domain_name} />

      <Card className="p-6">
        <StoreSettingsForm 
          settings={settings}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
        />
      </Card>
    </div>
  );
};