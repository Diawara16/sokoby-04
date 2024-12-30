import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerOverview() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vue d'ensemble des clients</h1>
      <Card>
        <CardHeader>
          <CardTitle>Analyse de la clientèle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Visualisez et analysez les données de votre base clients.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}