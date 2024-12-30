import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuration générale</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gérez les paramètres de votre compte et de votre boutique.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}