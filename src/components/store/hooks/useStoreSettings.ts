import { useStoreData } from "./useStoreData";
import { useStoreSave } from "./useStoreSave";

export const useStoreSettings = () => {
  const { settings, setSettings, isLoading, error, reloadSettings } = useStoreData();
  const { saveSettings } = useStoreSave();

  const handleSave = async () => {
    if (settings) {
      await saveSettings(settings);
    }
  };

  return {
    settings,
    setSettings,
    isLoading,
    error,
    handleSave,
    reloadSettings
  };
};