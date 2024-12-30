import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerLoyalty() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Programme de fidélité</h1>
      <Card>
        <CardHeader>
          <CardTitle>Fidélisation clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gérez vos programmes de fidélité et récompensez vos clients fidèles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}