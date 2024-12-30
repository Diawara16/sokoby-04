import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductStock() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion du stock</h1>
      <Card>
        <CardHeader>
          <CardTitle>Suivi des stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gérez vos niveaux de stock et configurez les alertes de réapprovisionnement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}