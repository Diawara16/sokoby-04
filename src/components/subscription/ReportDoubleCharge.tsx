import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";

export const ReportDoubleCharge = () => {
  const { reportDoubleCharge, isLoading } = useSubscriptionManagement();

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Facturation double ?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            Si vous avez été facturé deux fois par erreur, nous nous excusons pour ce désagrément. 
            Utilisez le bouton ci-dessous pour signaler le problème.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={reportDoubleCharge}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? 'Signalement en cours...' : 'Signaler une facturation double'}
          </Button>

          <div className="text-sm text-orange-700 space-y-2">
            <p className="font-medium">Autres moyens de nous contacter :</p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@votresite.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+33 1 23 45 67 89 (Lun-Ven 9h-18h)</span>
            </div>
          </div>

          <div className="text-xs text-orange-600 bg-orange-100 p-3 rounded">
            <p className="font-medium mb-1">Engagement de remboursement :</p>
            <p>
              Nous nous engageons à traiter tous les signalements de facturation double sous 24h 
              et à procéder au remboursement immédiat si l'erreur est confirmée.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};