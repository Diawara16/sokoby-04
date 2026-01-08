import { Product } from '@/types/product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // Use placeholder if image is missing
  const imageUrl = product.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80';

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="rounded-lg shadow-md p-4 bg-card hover:shadow-lg transition-shadow cursor-pointer">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4 bg-muted"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80';
          }}
        />
        <h3 className="text-lg font-semibold mb-2 text-card-foreground">{product.name}</h3>
        <p className="text-muted-foreground font-medium">{product.price} €</p>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
        )}
      </div>
    </Link>
  );
};