import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsTrends() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tendances</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analyse des tendances</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Visualisez l'évolution de vos ventes et identifiez les tendances clés de votre activité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}