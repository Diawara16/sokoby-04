import { useAppState } from '@/hooks/useAppState';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  const { loading, errors } = useAppState();

  if (loading?.products) {
    return <div>Chargement...</div>;
  }

  if (errors?.products) {
    return <div>Erreur: {errors.products}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};