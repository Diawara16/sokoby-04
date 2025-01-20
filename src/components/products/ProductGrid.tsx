import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products?: Product[];
}

export const ProductGrid = ({ products: initialProducts }: ProductGridProps = {}) => {
  const {
    isLoading,
    error,
    startLoading,
    stopLoading,
    handleError,
    isCacheValid,
    updateCache
  } = useAppState('products');

  const [products, setProducts] = useState<Product[]>(initialProducts || []);

  const fetchProducts = async () => {
    if (isCacheValid()) return;
    
    try {
      startLoading();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setProducts(data);
      updateCache();
    } catch (err) {
      handleError(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts();
    }
  }, [initialProducts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};