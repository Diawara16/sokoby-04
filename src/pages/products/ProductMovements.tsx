import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductMovements() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mouvements produits</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historique des mouvements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Suivez les entrées, sorties et transferts de vos produits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}