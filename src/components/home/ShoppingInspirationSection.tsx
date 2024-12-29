import React from 'react';

const ShoppingInspirationSection = () => {
  return (
    <section className="py-16 bg-white w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Inspirations Shopping</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ShoppingCard
            imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            title="Découvrez notre collection"
            description="Explorez nos dernières tendances"
          />
          <ShoppingCard
            imageUrl="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86"
            title="Nouveautés de la saison"
            description="Découvrez les dernières arrivées"
          />
          <ShoppingCard
            imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
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
    <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 group cursor-pointer">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-72 object-cover transform transition-transform group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
        <div className="p-6 text-white w-full">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShoppingInspirationSection;