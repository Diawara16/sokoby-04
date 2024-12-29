import React from 'react';

const ShoppingInspirationSection = () => {
  return (
    <section className="py-16 bg-white w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Inspirations Shopping</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ShoppingCard
            imageUrl="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            title="Découvrez notre collection"
            description="Explorez nos dernières tendances"
          />
          <ShoppingCard
            imageUrl="https://images.unsplash.com/photo-1472851294608-062f824d29cc"
            title="Nouveautés de la saison"
            description="Découvrez les dernières arrivées"
          />
          <ShoppingCard
            imageUrl="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04"
            title="Meilleures ventes"
            description="Nos produits les plus populaires"
          />
        </div>
      </div>
    </section>
  );
};

interface ShoppingCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const ShoppingCard = ({ imageUrl, title, description }: ShoppingCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative h-[300px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm opacity-90">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingInspirationSection;