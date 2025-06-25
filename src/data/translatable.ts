
export interface TranslatableTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  revenue?: string;
  storeType?: string;
}

export const testimonials: TranslatableTestimonial[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    role: 'Fondatrice, Mode & Style',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    content: "J'ai migré de Shopify vers Sokoby et j'économise 400€/mois tout en ayant de meilleures fonctionnalités. L'IA m'a fait gagner un temps fou !",
    revenue: '+180% de CA',
    rating: 5
  },
  {
    id: '2',
    name: 'Thomas Martin',
    role: 'CEO, Tech Gadgets',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: "Après 3 ans sur Shopify, le passage à Sokoby a été une révélation. Setup en 10 minutes, IA qui optimise tout, coûts divisés par 3.",
    revenue: '50k€/mois',
    rating: 5
  },
  {
    id: '3',
    name: 'Sophie Leclerc',
    role: 'Artisane, Bio & Nature',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content: "L'IA de Sokoby gère mes descriptions produits, mes prix et même mes campagnes marketing. Plus jamais Shopify avec ses coûts cachés !",
    revenue: '+250% ventes',
    rating: 5
  }
];

export interface TranslatableStat {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export const stats: TranslatableStat[] = [
  { id: '1', icon: 'Users', value: '25 000+', label: 'Entrepreneurs qui nous font confiance' },
  { id: '2', icon: 'Globe', value: '120+', label: 'Pays couverts' },
  { id: '3', icon: 'TrendingUp', value: '€2.5M', label: 'CA généré par nos clients ce mois' },
  { id: '4', icon: 'Star', value: '4.9/5', label: 'Note moyenne client' }
];

export interface TranslatableFeature {
  id: string;
  name: string;
  description: string;
}

export const modelComparisonFeatures = {
  aiStore: [
    'Boutique créée en 5-10 minutes',
    '30-100+ produits inclus et optimisés',
    'SEO et fournisseurs intégrés',
    'Design professionnel automatique'
  ],
  manual: [
    'Contrôle total du design',
    'Personnalisation illimitée',
    'Ajoutez vos propres produits',
    'Évolutif selon vos besoins'
  ]
};
