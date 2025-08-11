import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppConnections } from "@/components/integrations/useAppConnections";
import { Link } from "react-router-dom";

const providers = [
  { key: 'amazon', label: 'Amazon' },
  { key: 'ebay', label: 'eBay' },
  { key: 'walmart', label: 'Walmart' },
  { key: 'pinterest', label: 'Pinterest' },
  { key: 'facebook', label: 'Facebook Shops' },
  { key: 'tiktok', label: 'TikTok Shop' },
];

const StatusPill = ({ status }: { status: string }) => {
  const isConnected = status === 'active' || status === 'connected';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isConnected ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
      {isConnected ? 'Connecté' : 'Déconnecté'}
    </span>
  );
};

export const MarketplaceIntegrationsCard = () => {
  const { connections, isLoading } = useAppConnections();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Intégrations Marketplace</CardTitle>
        <CardDescription>Connectez vos canaux de vente pour synchroniser produits et commandes.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_,i) => (
              <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {providers.map(p => {
              const status = connections[p.key] || 'disconnected';
              return (
                <div key={p.key} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{p.label}</div>
                    <StatusPill status={status} />
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/integrations">{status === 'connected' || status === 'active' ? 'Gérer' : 'Connecter'}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
