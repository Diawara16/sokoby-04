import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DraftOrders() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Commandes provisoires</h1>
      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes provisoires</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucune commande provisoire pour le moment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}