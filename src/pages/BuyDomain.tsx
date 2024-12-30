import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuyDomain() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Acheter un domaine</h1>
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un domaine</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Trouvez le domaine parfait pour votre boutique.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}