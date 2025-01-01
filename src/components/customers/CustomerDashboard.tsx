import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Customer {
  id: string;
  full_name: string;
  phone_number: string;
  customer_type: string;
  total_orders: number;
  total_spent: number;
  last_purchase_date: string;
}

type SortField = 'full_name' | 'total_orders' | 'total_spent' | 'last_purchase_date';

export const CustomerDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerType, setCustomerType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        let query = supabase
          .from('customer_details')
          .select('*');

        if (searchTerm) {
          query = query.ilike('full_name', `%${searchTerm}%`);
        }

        if (customerType !== 'all') {
          query = query.eq('customer_type', customerType);
        }

        const { data, error } = await query.order(sortField, { ascending: sortDirection === 'asc' });

        if (error) throw error;

        setCustomers(data || []);
      } catch (error: any) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les clients",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [toast, searchTerm, customerType, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={customerType}
                onValueChange={setCustomerType}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Type de client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="individual">Particulier</SelectItem>
                  <SelectItem value="business">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('full_name')}
                    className="flex items-center"
                  >
                    Nom
                    <SortIcon field="full_name" />
                  </Button>
                </TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('total_orders')}
                    className="flex items-center"
                  >
                    Commandes
                    <SortIcon field="total_orders" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('total_spent')}
                    className="flex items-center"
                  >
                    Total dépensé
                    <SortIcon field="total_spent" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('last_purchase_date')}
                    className="flex items-center"
                  >
                    Dernier achat
                    <SortIcon field="last_purchase_date" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <Link 
                      to={`/clientele/${customer.id}`}
                      className="text-primary hover:underline"
                    >
                      {customer.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>
                    {customer.customer_type === 'business' ? 'Entreprise' : 'Particulier'}
                  </TableCell>
                  <TableCell>{customer.total_orders}</TableCell>
                  <TableCell>{customer.total_spent}€</TableCell>
                  <TableCell>
                    {customer.last_purchase_date 
                      ? new Date(customer.last_purchase_date).toLocaleDateString('fr-FR')
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
