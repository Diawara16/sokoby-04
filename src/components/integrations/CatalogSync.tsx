import { Button } from "@/components/ui/button";
import { useCatalogSync } from "@/hooks/useCatalogSync";
import { RefreshCw } from "lucide-react";

interface CatalogSyncProps {
  integrationId: string;
  productIds: string[];
}

export const CatalogSync = ({ integrationId, productIds }: CatalogSyncProps) => {
  const { isSyncing, syncCatalog } = useCatalogSync();

  return (
    <Button 
      onClick={() => syncCatalog(integrationId, productIds)}
      disabled={isSyncing}
      variant="outline"
      size="sm"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Synchronisation...' : 'Synchroniser le catalogue'}
    </Button>
  );
};