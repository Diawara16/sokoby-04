import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

const statusColors = {
  pending: "secondary",
  processing: "secondary",
  completed: "default",
  cancelled: "destructive",
  refunded: "outline",
} as const;

const statusLabels = {
  pending: "En attente",
  processing: "En cours",
  completed: "Complétée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

export const OrderList = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement des commandes...</div>;
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune commande trouvée
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Numéro</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              {format(new Date(order.created_at), 'PPP', { locale: fr })}
            </TableCell>
            <TableCell>#{order.id.slice(0, 8)}</TableCell>
            <TableCell>
              <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                {statusLabels[order.status as keyof typeof statusLabels]}
              </Badge>
            </TableCell>
            <TableCell>{order.total_amount.toFixed(2)} €</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/commandes/${order.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};