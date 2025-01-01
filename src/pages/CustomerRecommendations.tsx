import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductRecommendations } from "@/components/marketing/ProductRecommendations";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

export default function CustomerRecommendations() {
  const { profile } = useAuthAndProfile();

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recommandations Clients</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recommandations personnalisées</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductRecommendations customerId={profile.id} />
        </CardContent>
      </Card>
    </div>
  );
}