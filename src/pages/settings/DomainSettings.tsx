import { DomainsDashboard } from "@/components/domains/DomainsDashboard";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { useCurrentStoreId } from "@/hooks/useCurrentStoreId";

export default function DomainSettings() {
  const { storeId } = useCurrentStoreId();

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      <TrialBanner storeId={storeId} />
      <DomainsDashboard />
    </div>
  );
}
