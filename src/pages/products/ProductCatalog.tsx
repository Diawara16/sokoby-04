import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCatalog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catalogue produits</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gérez votre catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Centralisez et organisez tous vos produits dans un catalogue structuré.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}