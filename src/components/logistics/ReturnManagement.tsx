import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Truck, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Return {
  id: string;
  order_id: string;
  reason: string;
  status: string;
  automated_status: string;
  processing_notes: string[];
  tracking_number: string | null;
  description: string | null;
  created_at: string;
}

export const ReturnManagement = () => {
  const { toast } = useToast();
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);

  const { data: returns, isLoading, refetch } = useQuery({
    queryKey: ['returns-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Return[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'manual_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProcessReturn = async (returnId: string) => {
    try {
      const response = await fetch(
        'https://zlwvggnzyfldswpgebij.supabase.co/functions/v1/process-returns',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ returnId }),
        }
      );

      if (!response.ok) throw new Error('Erreur lors du traitement du retour');

      toast({
        title: "Retour traité",
        description: "Le retour a été traité avec succès",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du retour",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Gestion des retours automatisés
        </CardTitle>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {!returns?.length ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun retour à traiter
              </p>
            ) : (
              returns.map((returnItem) => (
                <div
                  key={returnItem.id}
                  className={`p-4 rounded-lg border ${
                    selectedReturn === returnItem.id ? 'border-primary' : 'border-border'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        Retour #{returnItem.id.slice(0, 8)}
                        {returnItem.automated_status === 'manual_review' && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Commande: #{returnItem.order_id.slice(0, 8)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(returnItem.automated_status)}>
                      {returnItem.automated_status}
                    </Badge>
                  </div>

                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Raison:</span> {returnItem.reason}</p>
                    {returnItem.tracking_number && (
                      <p><span className="font-medium">Numéro de suivi:</span> {returnItem.tracking_number}</p>
                    )}
                    {returnItem.processing_notes?.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Notes de traitement:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {returnItem.processing_notes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setSelectedReturn(
                        selectedReturn === returnItem.id ? null : returnItem.id
                      )}
                    >
                      <Info className="h-4 w-4" />
                      Détails
                    </Button>
                    {returnItem.automated_status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleProcessReturn(returnItem.id)}
                      >
                        Traiter
                      </Button>
                    )}
                  </div>

                  {selectedReturn === returnItem.id && returnItem.description && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm">{returnItem.description}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};