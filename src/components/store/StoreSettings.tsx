import { Card } from "@/components/ui/card";
import { useStoreSettings } from "./hooks/useStoreSettings";
import { DomainAlert } from "./DomainAlert";
import { StoreSettingsForm } from "./StoreSettingsForm";

export const StoreSettings = () => {
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
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Paramètres de la boutique</h2>
      
      <DomainAlert domainName={settings.domain_name} />

      <StoreSettingsForm 
        settings={settings}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
      />
    </Card>
  );
};