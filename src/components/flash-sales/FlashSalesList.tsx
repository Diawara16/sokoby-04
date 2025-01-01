import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { FlashSaleCard } from "./FlashSaleCard";
import { CreateFlashSale } from "./CreateFlashSale";

export function FlashSalesList() {
  const { data: flashSales, isLoading } = useQuery({
    queryKey: ["flash-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flash_sales")
        .select(`
          *,
          products (
            name
          )
        `)
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-[200px] animate-pulse bg-gray-200 rounded-lg" />
        <div className="h-[200px] animate-pulse bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CreateFlashSale />
      
      {!flashSales?.length ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune vente flash programmée
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flashSales.map((sale) => (
            <FlashSaleCard
              key={sale.id}
              productName={sale.products.name}
              discountPercent={sale.discount_percent}
              originalPrice={sale.original_price}
              salePrice={sale.sale_price}
              startTime={sale.start_time}
              endTime={sale.end_time}
              status={sale.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}