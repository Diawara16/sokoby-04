import { OrderHeader } from "./OrderHeader";
import { OrderAddresses } from "./OrderAddresses";
import { OrderItemsList } from "./OrderItemsList";
import { OrderStatistics } from "./OrderStatistics";
import { Card } from "@/components/ui/card";

export const OrderDetails = () => {
  return (
    <div className="space-y-8">
      <OrderStatistics />
      <Card>
        <OrderHeader />
        <OrderAddresses />
        <OrderItemsList />
      </Card>
    </div>
  );
};