
export interface StoreExample {
  id: string;
  name: string;
  niche: string;
  description: string;
  image: string;
  previewImages: string[];
  rating: number;
  features: string[];
  price: number;
  monthlyRevenue: string;
  conversionRate: string;
}

export const storeExamples: StoreExample[] = [
  {
    id: "1",
    name: "FitZone Pro",
    niche: "Fitness",
    description: "Boutique d'équipements de fitness premium avec programme d'entraînement personnalisé",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop"
    ],
    rating: 4.9,
    features: [
      "Design responsive optimisé",
      "Catalogue IA intelligent",
      "SEO ultra-performant",
      "Recommandations personnalisées",
      "Chat support 24/7",
      "Paiements sécurisés",
      "Programme de fidélité",
      "Analytics avancés"
    ],
    price: 20,
    monthlyRevenue: "€8,200",
    conversionRate: "4.2%"
  },
  {
    id: "2",
    name: "Elegance Hair Studio",
    niche: "Perruques",
    description: "Collection premium de perruques et extensions avec essai virtuel AR",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0411ba8b814?w=400&h=300&fit=crop"
    ],
    rating: 4.8,
    features: [
      "Essai virtuel AR",
      "Guide couleurs IA",
      "Chat expert beauté",
      "Livraison express",
      "Garantie qualité",
      "Retours gratuits",
      "Personnalisation 3D",
      "Conseils styling"
    ],
    price: 20,
    monthlyRevenue: "€6,500",
    conversionRate: "3.8%"
  },
  {
    id: "3",
    name: "Urban Style Co",
    niche: "Mode",
    description: "Vêtements streetwear tendance avec intelligence de style personnalisée",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop"
    ],
    rating: 4.7,
    features: [
      "Styliste IA personnel",
      "Essai virtuel AR",
      "Recommandations tendance",
      "Blog mode intégré",
      "Programme influenceur",
      "Size-guide intelligent",
      "Mix & match IA",
      "Wishlist sociale"
    ],
    price: 19,
    monthlyRevenue: "€12,300",
    conversionRate: "5.1%"
  },
  {
    id: "4",
    name: "TechSphere",
    niche: "Electronics",
    description: "Gadgets électroniques et accessoires high-tech avec comparateur intelligent",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    ],
    rating: 4.6,
    features: [
      "Comparateur IA avancé",
      "Reviews clients vérifiées",
      "Support technique 24/7",
      "Garantie étendue",
      "Installation gratuite",
      "Trade-in intelligent",
      "Alertes prix",
      "Configuration automatique"
    ],
    price: 19,
    monthlyRevenue: "€15,700",
    conversionRate: "3.4%"
  },
  {
    id: "5",
    name: "Lumière Bijoux",
    niche: "Bijoux",
    description: "Bijoux artisanaux et créations sur-mesure avec certificat d'authenticité",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1596944946989-b142b6d28570?w=400&h=300&fit=crop"
    ],
    rating: 4.9,
    features: [
      "Certificat authenticité",
      "Gravure personnalisée IA",
      "Écrin luxe gratuit",
      "Consultation bijoutier",
      "Réparation à vie",
      "Mise à taille gratuite",
      "Assurance incluse",
      "Collection exclusive"
    ],
    price: 25,
    monthlyRevenue: "€9,800",
    conversionRate: "2.9%"
  },
  {
    id: "6",
    name: "Everything Store Pro",
    niche: "General",
    description: "Marketplace généraliste avec plus de 500 produits et IA de recommandation",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop",
    previewImages: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop"
    ],
    rating: 4.5,
    features: [
      "500+ produits variés",
      "IA de recommandation",
      "Stock illimité",
      "Livraison same-day",
      "Multi-vendeurs",
      "Cashback automatique",
      "Price-match garanti",
      "Service concierge"
    ],
    price: 80,
    monthlyRevenue: "€28,500",
    conversionRate: "4.7%"
  }
];
