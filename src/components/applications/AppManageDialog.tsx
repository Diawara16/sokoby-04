import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { applications } from "@/data/applications";
import { useAppConnections } from "@/hooks/useAppConnections";
import { ExternalLink, Settings, Trash2, RefreshCw } from "lucide-react";

interface AppManageDialogProps {
  appName: string;
  onClose: () => void;
}

export function AppManageDialog({ appName, onClose }: AppManageDialogProps) {
  const { connectedApps, handleDisconnect } = useAppConnections();
  
  const app = applications.find(a => a.name === appName);
  const connection = connectedApps[appName];

  if (!app) return null;

  const handleDisconnectApp = async () => {
    await handleDisconnect(appName);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <app.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>{app.name}</DialogTitle>
              <DialogDescription>{app.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                État de la connexion
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 text-green-700"
                >
                  Connectée
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cette application est connectée et fonctionne correctement.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnecter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(app.authUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir l'application
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          {app.features && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fonctionnalités</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {app.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Pricing */}
          {app.price && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tarification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Plan mensuel</span>
                    <span className="font-semibold">€{app.price.monthly}/mois</span>
                  </div>
                  {app.price.annual && (
                    <div className="flex justify-between items-center">
                      <span>Plan annuel</span>
                      <span className="font-semibold">€{app.price.annual}/an</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisconnectApp}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Désinstaller
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}