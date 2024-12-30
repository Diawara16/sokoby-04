import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AbandonedCheckouts() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Paiements abandonnés</h1>
      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements abandonnés</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucun paiement abandonné pour le moment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}