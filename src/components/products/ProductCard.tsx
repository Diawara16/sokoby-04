import { Product } from '@/types/product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = product.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80';

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="rounded-xl overflow-hidden bg-card shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.03]">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover bg-muted"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&q=80';
          }}
        />
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground truncate">{product.name}</h3>
          <p className="text-primary font-bold mt-1">{product.price} €</p>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
