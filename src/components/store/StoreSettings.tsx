import { Card } from "@/components/ui/card";
import { useStoreSettings } from "./hooks/useStoreSettings";
import { DomainAlert } from "./DomainAlert";
import { StoreSettingsForm } from "./StoreSettingsForm";

interface StoreSettingsProps {
  showDomainOnly?: boolean;
}

export const StoreSettings = ({ showDomainOnly = false }: StoreSettingsProps) => {
  const { settings, setSettings, isLoading, handleSave } = useStoreSettings();

  const handleFieldChange = (field: string, value: string) => {
    setSettings(prev => prev ? {...prev, [field]: value} : null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Aucun paramètre trouvé. Veuillez réessayer.
      </div>
    );
  }

  if (showDomainOnly) {
    return <DomainAlert domainName={settings.domain_name} />;
  }

  return (
    <div className="space-y-6">
      <DomainAlert domainName={settings.domain_name} />

      <StoreSettingsForm 
        settings={settings}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
      />
    </div>
  );
};