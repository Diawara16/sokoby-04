import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Invoice } from "@/hooks/useSubscriptionManagement";

interface InvoiceHistoryProps {
  invoices: Invoice[];
}

export const InvoiceHistory = ({ invoices }: InvoiceHistoryProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Payé</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Historique des factures
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{formatAmount(invoice.amount)}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Date: {formatDate(invoice.created_at)}</p>
                    {invoice.payment_method && (
                      <p>Méthode: {invoice.payment_method}</p>
                    )}
                  </div>
                </div>
                {invoice.invoice_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(invoice.invoice_url, '_blank')}
                    className="ml-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune facture disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};