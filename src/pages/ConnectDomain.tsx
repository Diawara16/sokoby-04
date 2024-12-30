import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConnectDomain() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Connecter un domaine</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuration du domaine</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connectez votre domaine existant à votre boutique.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}