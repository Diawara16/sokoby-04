import { MarketplaceCard } from "./MarketplaceCard";

interface MarketplaceGridProps {
  marketplaces: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  integrations: Record<string, any>;
  onConnect: (marketplaceId: string) => void;
  isLoading: boolean;
}

export const MarketplaceGrid = ({ 
  marketplaces, 
  integrations, 
  onConnect, 
  isLoading 
}: MarketplaceGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {marketplaces.map((marketplace) => (
        <MarketplaceCard
          key={marketplace.id}
          name={marketplace.name}
          description={marketplace.description}
          status={integrations[marketplace.id]?.status || 'disconnected'}
          onConnect={() => onConnect(marketplace.id)}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};