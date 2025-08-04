import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendsDashboard } from "./TrendsDashboard";
import { BehaviorAnalytics } from "./BehaviorAnalytics";
import { CustomReportBuilder } from "./CustomReportBuilder";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const AnalyticsDashboard = () => {
  const { toast } = useToast();

  const exportAnalytics = async () => {
    try {
      const { data: behaviors } = await supabase
        .from('user_behaviors')
        .select('*')
        .order('created_at', { ascending: false });

      const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,Event Type,Page URL\n"
        + behaviors?.map(row => 
            `${new Date(row.created_at).toLocaleDateString()},${row.event_type},${row.page_url}`
          ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "analytics_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Rapport exporté",
        description: "Le rapport a été téléchargé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le rapport",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        await supabase.from('user_behaviors').insert({
          event_type: 'page_view',
          page_url: window.location.pathname,
          event_data: { referrer: document.referrer },
          user_id: user.id
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    trackPageView();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics et Rapports</h2>
        <Button onClick={exportAnalytics}>
          <Download className="mr-2 h-4 w-4" />
          Exporter les données
        </Button>
      </div>

      <TrendsDashboard />
      
      <div className="grid gap-6 md:grid-cols-2">
        <BehaviorAnalytics />
        <CustomReportBuilder />
      </div>
    </div>
  );
};