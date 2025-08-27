import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { applications } from "@/data/applications";
import { useAppConnections } from "@/hooks/useAppConnections";
import { Settings, Trash2, Power } from "lucide-react";
import { useState } from "react";
import { AppManageDialog } from "./AppManageDialog";

export function InstalledApps() {
  const { connectedApps, isLoading, handleDisconnect } = useAppConnections();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const installedApps = applications.filter(app => 
    connectedApps[app.name] && connectedApps[app.name].status === 'active'
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (installedApps.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Power className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune application installée</h3>
          <p className="text-muted-foreground mb-4">
            Commencez par installer des applications depuis le catalogue pour étendre les fonctionnalités de votre boutique.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {installedApps.map((app) => {
          const connection = connectedApps[app.name];
          return (
            <Card key={app.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <app.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{app.name}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className="mt-1 bg-green-100 text-green-700"
                      >
                        Installée
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {app.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedApp(app.name)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Gérer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDisconnect(app.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedApp && (
        <AppManageDialog
          appName={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </>
  );
}