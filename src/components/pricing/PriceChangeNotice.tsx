import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Calendar } from "lucide-react";

interface PriceChangeNoticeProps {
  currentPlan: 'starter' | 'pro' | 'enterprise';
  currentPrice: string;
  newPrice: string;
  effectiveDate: string;
  onDismiss?: () => void;
}

export const PriceChangeNotice = ({ 
  currentPlan, 
  currentPrice, 
  newPrice, 
  effectiveDate,
  onDismiss 
}: PriceChangeNoticeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const planNames = {
    starter: 'Essentiel',
    pro: 'Pro',
    enterprise: 'Premium'
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleManageSubscription = () => {
    window.location.href = '/dashboard/subscription';
  };

  if (!isVisible) return null;

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                Modification de tarifs - Préavis important
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 space-y-2 text-sm text-orange-700 dark:text-orange-300">
              <p>
                Nous vous informons que les tarifs de votre abonnement <strong>{planNames[currentPlan]}</strong> évolueront 
                de <strong>{currentPrice}</strong> à <strong>{newPrice}/mois</strong>.
              </p>
              
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  Date d'application : {new Date(effectiveDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <p className="text-xs">
                Cette modification respecte le préavis légal de 30 jours. 
                Vous pouvez à tout moment modifier ou annuler votre abonnement.
              </p>
            </div>
            
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={handleManageSubscription}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Gérer mon abonnement
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                J'ai compris
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};