import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailCampaignForm } from "@/components/marketing/EmailCampaignForm";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

interface CampaignStats {
  emails_sent: number;
  opens: number;
  clicks: number;
  unsubscribes: number;
}

export default function EmailMarketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
    fetchGlobalStats();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les campagnes",
        variant: "destructive",
      });
    }
  };

  const fetchGlobalStats = async () => {
    try {
      const { data, error } = await supabase
        .from("email_campaign_stats")
        .select("emails_sent, opens, clicks, unsubscribes")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Email Marketing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Emails envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.emails_sent || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Taux d'ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats?.emails_sent
                ? Math.round((stats.opens / stats.emails_sent) * 100)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Taux de clic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats?.emails_sent
                ? Math.round((stats.clicks / stats.emails_sent) * 100)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">Nouvelle Campagne</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <EmailCampaignForm onSuccess={fetchCampaigns} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des campagnes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-gray-500">
                            {campaign.subject}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              campaign.status === "sent"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {campaign.status === "sent" ? "Envoyée" : "Brouillon"}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}