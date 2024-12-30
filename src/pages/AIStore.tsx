import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIStore() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Boutique IA</h1>
      <Card>
        <CardHeader>
          <CardTitle>Créer votre boutique IA</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Commencez à créer votre boutique alimentée par l'IA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}