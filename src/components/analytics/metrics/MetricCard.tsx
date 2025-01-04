import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: number;
}

export const MetricCard = ({ title, value, description, icon, trend }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        {trend !== undefined && (
          <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};