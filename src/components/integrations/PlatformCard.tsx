import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { PlatformConfig } from './types/platform';
import { CatalogSync } from './CatalogSync';
import { SyncStatus } from './SyncStatus';

interface PlatformCardProps {
  platform: PlatformConfig;
  isLoading: boolean;
  onIntegrate: (platform: PlatformConfig) => void;
  currentStatus?: string;
  integrationId?: string;
  productIds?: string[];
}

export const PlatformCard = ({ 
  platform, 
  isLoading, 
  onIntegrate, 
  currentStatus,
  integrationId,
  productIds = []
}: PlatformCardProps) => {
  const status = currentStatus || platform.status;
  
  return (
    <Card className="relative overflow-hidden">
      {platform.status === 'coming_soon' && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
          Bientôt disponible
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {platform.icon}
          {platform.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{platform.description}</p>
        {status === 'unavailable' ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>{platform.message}</span>
          </div>
        ) : (
          <>
            <Button 
              onClick={() => onIntegrate(platform)}
              disabled={isLoading || status === 'coming_soon'}
              className="w-full mb-4"
              variant={status === 'coming_soon' ? "outline" : "default"}
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              )}
              {status === 'coming_soon' 
                ? "Bientôt disponible" 
                : `Connecter ${platform.name}`}
            </Button>
            
            {status === 'active' && integrationId && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <CatalogSync 
                    integrationId={integrationId}
                    productIds={productIds}
                  />
                  {productIds.map(productId => (
                    <SyncStatus 
                      key={productId}
                      integrationId={integrationId}
                      productId={productId}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};