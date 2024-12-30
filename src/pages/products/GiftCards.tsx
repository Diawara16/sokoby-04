import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GiftCards() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cartes cadeaux</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des cartes cadeaux</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Créez et gérez vos cartes cadeaux personnalisées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}