import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { useOrderStatus } from '@/hooks/useOrderStatus';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from '@/types/orders';

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

interface OrderHeaderProps {
  order: Order;
  onStatusUpdate: () => void;
}

export const OrderHeader = ({ order, onStatusUpdate }: OrderHeaderProps) => {
  const { updateOrderStatus, isUpdating } = useOrderStatus();

  const handleStatusChange = async (newStatus: string) => {
    const success = await updateOrderStatus(order.id, newStatus);
    if (success) {
      onStatusUpdate();
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Commande #{order.id.slice(0, 8)}</h2>
        <p className="text-muted-foreground">
          {format(new Date(order.created_at), 'PPP', { locale: fr })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
          {statusLabels[order.status as keyof typeof statusLabels]}
        </Badge>
        <Select
          disabled={isUpdating}
          value={order.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Changer le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="processing">En cours</SelectItem>
            <SelectItem value="completed">Complétée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
            <SelectItem value="refunded">Remboursée</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};