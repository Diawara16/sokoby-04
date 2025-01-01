import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";

interface FlashSaleCardProps {
  productName: string;
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
  startTime: string;
  endTime: string;
  status: string;
}

export function FlashSaleCard({
  productName,
  discountPercent,
  originalPrice,
  salePrice,
  startTime,
  endTime,
  status,
}: FlashSaleCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "ended":
        return "bg-gray-500";
      default:
        return "bg-red-500";
    }
  };

  const getTimeDisplay = () => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (status === "active") {
      return `Se termine ${formatDistanceToNow(end, { addSuffix: true, locale: fr })}`;
    }
    if (status === "scheduled") {
      return `Commence ${formatDistanceToNow(start, { addSuffix: true, locale: fr })}`;
    }
    return `Terminé ${formatDistanceToNow(end, { addSuffix: true, locale: fr })}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{productName}</CardTitle>
          <Badge className={getStatusColor()}>
            {status === "active" ? "En cours" : 
             status === "scheduled" ? "Programmée" : 
             "Terminée"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {getTimeDisplay()}
          </div>
          <div className="flex items-center text-sm">
            <Tag className="mr-2 h-4 w-4" />
            <span className="line-through text-muted-foreground">{originalPrice}€</span>
            <span className="ml-2 font-bold text-primary">{salePrice}€</span>
            <span className="ml-2 text-green-600">-{discountPercent}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}