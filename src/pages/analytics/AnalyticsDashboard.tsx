import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Users, ShoppingCart } from "lucide-react";

export default function AnalyticsDashboard() {
  const metrics = [
    {
      title: "Chiffre d'affaires",
      value: "0,00 €",
      description: "Sur les 30 derniers jours",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Visiteurs uniques",
      value: "0",
      description: "Aujourd'hui",
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Taux de conversion",
      value: "0%",
      description: "Moyenne mensuelle",
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Commandes",
      value: "0",
      description: "Cette semaine",
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord analytique</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}