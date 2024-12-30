import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerGroups() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Groupes d'acheteurs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Segmentation de la clientèle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Créez et gérez des groupes personnalisés pour mieux cibler vos clients.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}