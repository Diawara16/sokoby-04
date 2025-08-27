import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { applications } from "@/data/applications";
import { useAppConnections } from "@/hooks/useAppConnections";
import { Download, Check, Loader2 } from "lucide-react";
import { useState } from "react";

export function AppCatalogue() {
  const { connectedApps, isLoading, handleConnect } = useAppConnections();
  const [connectingApp, setConnectingApp] = useState<string | null>(null);

  const handleInstall = async (app: typeof applications[0]) => {
    setConnectingApp(app.name);
    try {
      await handleConnect(app.name, app.authUrl);
    } finally {
      setConnectingApp(null);
    }
  };

  const getAppStatus = (appName: string) => {
    const connection = connectedApps[appName];
    if (connection?.status === 'active') return 'installed';
    if (connection?.status === 'pending') return 'pending';
    return 'available';
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Canaux de vente</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications
              .filter(app => app.type === "sales_channel")
              .map((app) => {
                const status = getAppStatus(app.name);
                const isConnecting = connectingApp === app.name;
                
                return (
                  <Card key={app.id} className="relative transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <app.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{app.name}</CardTitle>
                            {status === 'installed' && (
                              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                                Installée
                              </Badge>
                            )}
                            {status === 'pending' && (
                              <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-700">
                                En attente
                              </Badge>
                            )}
                          </div>
                        </div>
                        {app.price && (
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              €{app.price.monthly}/mois
                            </div>
                            {app.price.annual && (
                              <div className="text-xs text-muted-foreground">
                                €{app.price.annual}/an
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {app.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {app.features && (
                        <div className="mb-4">
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {app.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <Button
                        className="w-full"
                        variant={status === 'installed' ? "secondary" : "default"}
                        disabled={status === 'installed' || isConnecting}
                        onClick={() => handleInstall(app)}
                      >
                        {isConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {status === 'installed' && <Check className="h-4 w-4 mr-2" />}
                        {!isConnecting && status !== 'installed' && <Download className="h-4 w-4 mr-2" />}
                        
                        {status === 'installed' ? 'Installée' : 
                         isConnecting ? 'Installation...' : 'Installer'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Fournisseurs de dropshipping</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications
              .filter(app => app.type === "dropshipping")
              .map((app) => {
                const status = getAppStatus(app.name);
                const isConnecting = connectingApp === app.name;
                
                return (
                  <Card key={app.id} className="relative transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <app.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{app.name}</CardTitle>
                            {status === 'installed' && (
                              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                                Connecté
                              </Badge>
                            )}
                            {status === 'pending' && (
                              <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-700">
                                En attente
                              </Badge>
                            )}
                          </div>
                        </div>
                        {app.price && (
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              €{app.price.monthly}/mois
                            </div>
                            {app.price.annual && (
                              <div className="text-xs text-muted-foreground">
                                €{app.price.annual}/an
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {app.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {app.features && (
                        <div className="mb-4">
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {app.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <Button
                        className="w-full"
                        variant={status === 'installed' ? "secondary" : "default"}
                        disabled={status === 'installed' || isConnecting}
                        onClick={() => handleInstall(app)}
                      >
                        {isConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {status === 'installed' && <Check className="h-4 w-4 mr-2" />}
                        {!isConnecting && status !== 'installed' && <Download className="h-4 w-4 mr-2" />}
                        
                        {status === 'installed' ? 'Connecté' : 
                         isConnecting ? 'Connexion...' : 'Connecter'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}