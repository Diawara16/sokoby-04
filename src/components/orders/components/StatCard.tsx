
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { StatCard as StatCardType } from "../types/orderStats";

export const StatCard = ({ title, value, icon, description, secondaryValue }: StatCardType) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {secondaryValue && (
          <p className={`text-xs mt-2 ${
            secondaryValue.includes('+') 
              ? 'text-success-500' 
              : 'text-destructive'
          }`}>
            {secondaryValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
