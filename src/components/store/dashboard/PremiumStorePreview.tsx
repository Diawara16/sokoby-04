import { Store, ShoppingBag, Shield, Truck, Headphones, Star, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_active: boolean;
}

interface BrandSettings {
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  slogan: string;
}

interface PremiumStorePreviewProps {
  storeName: string;
  products: Product[];
  brandSettings: BrandSettings | null;
  activeTheme: string;
}

const themeStyles: Record<string, { bg: string; card: string; text: string; accent: string; heroGradient: string }> = {
  "minimal-luxury": {
    bg: "bg-white",
    card: "bg-white border border-gray-100",
    text: "text-gray-900",
    accent: "text-gray-700",
    heroGradient: "from-gray-900 via-gray-800 to-gray-700",
  },
  "bold-sales": {
    bg: "bg-orange-50",
    card: "bg-white border-2 border-orange-200",
    text: "text-gray-900",
    accent: "text-orange-600",
    heroGradient: "from-red-600 via-orange-500 to-yellow-500",
  },
  "soft-pastel": {
    bg: "bg-pink-50/50",
    card: "bg-white border border-pink-100",
    text: "text-gray-800",
    accent: "text-pink-600",
    heroGradient: "from-pink-400 via-purple-400 to-indigo-400",
  },
  "dark-premium": {
    bg: "bg-gray-950",
    card: "bg-gray-900 border border-gray-800",
    text: "text-white",
    accent: "text-amber-400",
    heroGradient: "from-gray-900 via-black to-gray-900",
  },
};

export function PremiumStorePreview({ storeName, products, brandSettings, activeTheme }: PremiumStorePreviewProps) {
  const theme = themeStyles[activeTheme] || themeStyles["minimal-luxury"];
  const primaryColor = brandSettings?.primary_color || "#E53935";

  return (
    <div className={`rounded-xl overflow-hidden border shadow-xl ${theme.bg}`}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {brandSettings?.logo_url ? (
            <img src={brandSettings.logo_url} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
              <Store className="h-4 w-4 text-white" />
            </div>
          )}
          <span className={`font-bold text-lg ${theme.text}`}>{storeName}</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <span className={`cursor-pointer hover:opacity-70 ${theme.accent}`}>Accueil</span>
          <span className={`cursor-pointer hover:opacity-70 ${theme.accent}`}>Boutique</span>
          <span className={`cursor-pointer hover:opacity-70 ${theme.accent}`}>Contact</span>
        </nav>
        <Button size="sm" style={{ backgroundColor: primaryColor }} className="text-white hover:opacity-90">
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${theme.heroGradient} text-white px-8 py-16 sm:py-24 text-center`}>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
          {brandSettings?.slogan || `Bienvenue chez ${storeName}`}
        </h1>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Découvrez notre collection exclusive de produits sélectionnés avec soin
        </p>
        <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 rounded-full shadow-lg">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Acheter maintenant
        </Button>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-12">
        <h2 className={`text-2xl font-bold mb-8 text-center ${theme.text}`}>
          Produits populaires
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className={`${theme.card} rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="aspect-square bg-muted/50 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>
              <div className="p-3">
                <h3 className={`font-medium text-sm truncate ${theme.text}`}>{product.name}</h3>
                <span
                  className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {product.price.toFixed(2)}€
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-6 py-12 border-t">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Shield, title: "Paiement sécurisé", desc: "Transactions cryptées SSL" },
            { icon: Truck, title: "Livraison rapide", desc: "Expédition sous 24-48h" },
            { icon: Headphones, title: "Support 24/7", desc: "Une équipe à votre écoute" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Icon className="h-6 w-6" style={{ color: primaryColor }} />
              </div>
              <h4 className={`font-semibold text-sm ${theme.text}`}>{title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <h4 className="font-bold mb-3">{storeName}</h4>
            <p className="text-sm text-gray-400">
              {brandSettings?.slogan || "Votre boutique en ligne de confiance"}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@{storeName.toLowerCase().replace(/\s/g, '')}.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> France</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3">Suivez-nous</h4>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {storeName}. Tous droits réservés. Propulsé par Sokoby.
        </div>
      </div>
    </div>
  );
}
