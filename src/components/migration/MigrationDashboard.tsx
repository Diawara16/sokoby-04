
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";

interface MigrationStep {
  id: string;
  step_name: string;
  step_order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

interface MigrationRequest {
  id: string;
  source_platform: string;
  shopify_store_url: string;
  contact_email: string;
  store_size: string;
  status: string;
  created_at: string;
  estimated_completion_date?: string;
  migration_steps: MigrationStep[];
}

export const MigrationDashboard = () => {
  const [requests, setRequests] = useState<MigrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMigrationRequests = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('shopify-migration', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setRequests(data.requests || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des migrations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos demandes de migration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMigrationRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateProgress = (steps: MigrationStep[]) => {
    const totalSteps = steps.length;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement de vos migrations...</div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Migrations Shopify</CardTitle>
          <CardDescription>
            Aucune demande de migration trouvée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de demande de migration en cours.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <a href="/migration-shopify">Commencer une migration</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes migrations</h2>
        <Button 
          onClick={fetchMigrationRequests}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Migration depuis {request.source_platform}
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1">{request.status}</span>
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {request.shopify_store_url} • Créée le {new Date(request.created_at).toLocaleDateString('fr-FR')}
                </CardDescription>
              </div>
              <div className="text-right text-sm text-gray-600">
                Taille: {request.store_size}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm text-gray-600">
                  {Math.round(calculateProgress(request.migration_steps))}%
                </span>
              </div>
              <Progress value={calculateProgress(request.migration_steps)} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Étapes de migration</h4>
              <div className="grid gap-2">
                {request.migration_steps
                  .sort((a, b) => a.step_order - b.step_order)
                  .map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(step.status)}
                        <span className="text-sm">{step.step_name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(step.status)} text-white`}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            {request.estimated_completion_date && request.status !== 'completed' && (
              <div className="text-sm text-gray-600">
                <strong>Estimation de fin :</strong> {new Date(request.estimated_completion_date).toLocaleDateString('fr-FR')}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
