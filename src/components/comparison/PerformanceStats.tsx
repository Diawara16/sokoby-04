
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

export function PerformanceStats() {
  const stats = [
    {
      label: "Boutiques IA créées",
      aiValue: "500+",
      manualValue: "∞",
      icon: Users,
      description: "Boutiques générées avec succès"
    },
    {
      label: "Temps moyen de création",
      aiValue: "8 min",
      manualValue: "30+ heures",
      icon: Clock,
      description: "Du concept à la boutique en ligne"
    },
    {
      label: "CA moyen mensuel",
      aiValue: "€4,200",
      manualValue: "€2,800",
      icon: DollarSign,
      description: "Chiffre d'affaires des 6 premiers mois"
    },
    {
      label: "Taux de réussite",
      aiValue: "94%",
      manualValue: "67%",
      icon: TrendingUp,
      description: "Boutiques rentables après 3 mois"
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle>Comparaison des performances réelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-gray-600">IA:</span>
                      <span className="font-bold text-primary">{stat.aiValue}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-gray-600">Manuel:</span>
                      <span className="font-bold text-gray-700">{stat.manualValue}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{stat.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
