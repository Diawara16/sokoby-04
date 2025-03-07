import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Pencil } from "lucide-react";
import { CustomerEditForm } from './CustomerEditForm';
import { CustomerInfoTab } from './tabs/CustomerInfoTab';
import { CustomerOrdersTab } from './tabs/CustomerOrdersTab';
import { CustomerNotesTab } from './tabs/CustomerNotesTab';

interface CustomerDetails {
  id: string;
  full_name: string;
  phone_number: string;
  customer_type: string;
  company_name: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  notes: string | null;
  total_orders: number;
  total_spent: number;
  last_purchase_date: string | null;
}

export const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchCustomerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_details')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Client non trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {customer.full_name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({customer.customer_type === 'business' ? 'Entreprise' : 'Particulier'})
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <CustomerInfoTab customer={customer} />
            </TabsContent>

            <TabsContent value="orders">
              <CustomerOrdersTab customer={customer} />
            </TabsContent>

            <TabsContent value="notes">
              <CustomerNotesTab customerId={customer.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier les informations du client</DialogTitle>
          </DialogHeader>
          <CustomerEditForm 
            customer={customer}
            onClose={() => setIsEditDialogOpen(false)}
            onUpdate={fetchCustomerDetails}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};