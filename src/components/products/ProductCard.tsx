import { Product } from '@/types/product';
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="rounded-lg shadow-md p-4 bg-card hover:shadow-lg transition-shadow">
      {product.image ? (
        <OptimizedImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
          loadingClassName="animate-pulse bg-muted"
        />
      ) : (
        <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Aucune image</span>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2 text-card-foreground">{product.name}</h3>
      <p className="text-muted-foreground font-medium">{product.price} €</p>
      {product.description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
      )}
    </div>
  );
};