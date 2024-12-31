import { Card } from "@/components/ui/card";

const ShoppingInspirationSection = () => {
  return (
    <section className="pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Inspirations Shopping
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                alt="Collection"
                className="object-cover w-full h-64"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Découvrez notre collection
                </h3>
                <p className="text-sm text-gray-200">
                  Explorez nos dernières tendances
                </p>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                alt="Nouveautés"
                className="object-cover w-full h-64"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nouveautés de la saison
                </h3>
                <p className="text-sm text-gray-200">
                  Découvrez les dernières arrivées
                </p>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
                alt="Meilleures ventes"
                className="object-cover w-full h-64"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Meilleures ventes
                </h3>
                <p className="text-sm text-gray-200">
                  Les produits les plus populaires
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ShoppingInspirationSection;