import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PopularProduct } from "../types/orderStats";

interface PopularProductsProps {
  products: PopularProduct[];
}

export const PopularProducts = ({ products }: PopularProductsProps) => {
  if (products.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Produits les plus vendus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.total_quantity} unités vendues
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{product.total_revenue.toFixed(2)} €</p>
                <p className="text-sm text-muted-foreground">
                  CA total
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};