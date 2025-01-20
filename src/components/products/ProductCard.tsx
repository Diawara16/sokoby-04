import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="rounded-lg shadow-md p-4">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600">{product.price} €</p>
    </div>
  );
};