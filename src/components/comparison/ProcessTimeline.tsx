
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Bot, User } from "lucide-react";

export function ProcessTimeline() {
  const aiSteps = [
    { step: "Choix de niche", time: "1 min", icon: CheckCircle },
    { step: "Génération IA", time: "5 min", icon: Bot },
    { step: "Boutique prête", time: "Total: 6 min", icon: CheckCircle }
  ];

  const manualSteps = [
    { step: "Recherche de produits", time: "4-6h", icon: Clock },
    { step: "Design et structure", time: "8-12h", icon: Clock },
    { step: "Ajout de contenu", time: "6-8h", icon: Clock },
    { step: "Configuration SEO", time: "3-4h", icon: Clock },
    { step: "Tests et corrections", time: "2-3h", icon: Clock },
    { step: "Boutique prête", time: "Total: 25-35h", icon: User }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bot className="h-5 w-5" />
            Timeline Boutique IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.step}</div>
                    <div className="text-sm text-gray-600">{step.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">6 minutes</div>
              <div className="text-sm text-gray-600">Boutique complètement opérationnelle</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <User className="h-5 w-5" />
            Timeline Création Manuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {manualSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.step}</div>
                    <div className="text-sm text-gray-600">{step.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">25-35 heures</div>
              <div className="text-sm text-gray-600">Plusieurs semaines de travail</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
