import { StoreSettings as StoreSettingsComponent } from "@/components/store/StoreSettings";

const StoreSettings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres de la boutique</h1>
      <StoreSettingsComponent />
    </div>
  );
};

export default StoreSettings;