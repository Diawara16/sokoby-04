import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface TrialStatusProps {
  trialEndsAt: string | null;
}

export const TrialStatus = ({ trialEndsAt }: TrialStatusProps) => {
  const getDaysRemaining = () => {
    if (!trialEndsAt) return 0;
    const daysRemaining = differenceInDays(new Date(trialEndsAt), new Date());
    return Math.max(0, daysRemaining);
  };

  const daysRemaining = getDaysRemaining();
  const trialProgress = ((14 - daysRemaining) / 14) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Statut de votre période d'essai
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trialEndsAt ? (
          <div className="space-y-4">
            <Progress value={trialProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Il vous reste {daysRemaining} jours d'essai gratuit
              {daysRemaining > 0 && ` (se termine le ${format(new Date(trialEndsAt), "d MMMM yyyy", { locale: fr })})`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Période d'essai terminée
          </p>
        )}
      </CardContent>
    </Card>
  );
};