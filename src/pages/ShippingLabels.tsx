import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShippingLabels() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Étiquettes d'expédition</h1>
      <Card>
        <CardHeader>
          <CardTitle>Liste des étiquettes d'expédition</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucune étiquette d'expédition pour le moment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}