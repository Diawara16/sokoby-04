import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { ProductCard } from './ProductCard';
import { supabase } from '@/lib/supabase';

export const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const { loading, errors, startLoading, stopLoading, handleError } = useAppState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading('products');
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        handleError('products', error as Error);
      } finally {
        stopLoading('products');
      }
    };

    fetchProducts();
  }, []);

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