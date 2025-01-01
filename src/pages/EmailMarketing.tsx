import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailCampaignForm } from "@/components/marketing/EmailCampaignForm";

export default function EmailMarketing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Email Marketing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Créer une nouvelle campagne</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailCampaignForm />
        </CardContent>
      </Card>
    </div>
  );
}