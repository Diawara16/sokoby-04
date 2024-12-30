import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsReports() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Rapports avancés</h1>
      <Card>
        <CardHeader>
          <CardTitle>Rapports personnalisés</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Générez des rapports détaillés et exportez vos données pour une analyse approfondie.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}