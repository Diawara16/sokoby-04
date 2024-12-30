import React from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  BarChart, 
  Settings 
} from "lucide-react";

const navigationItems = [
  {
    title: "Boutique",
    icon: <ShoppingCart className="w-5 h-5" />,
    description: "Gérez votre boutique en ligne",
    path: "/boutique",
    color: "text-blue-500"
  },
  {
    title: "Produits",
    icon: <Package className="w-5 h-5" />,
    description: "Gérez votre catalogue de produits",
    path: "/produits",
    color: "text-green-500"
  },
  {
    title: "Clients",
    icon: <Users className="w-5 h-5" />,
    description: "Suivez et gérez vos clients",
    path: "/clients",
    color: "text-purple-500"
  },
  {
    title: "Contenu",
    icon: <FileText className="w-5 h-5" />,
    description: "Gérez le contenu de votre boutique",
    path: "/contenu",
    color: "text-orange-500"
  },
  {
    title: "Analyses",
    icon: <BarChart className="w-5 h-5" />,
    description: "Consultez vos statistiques",
    path: "/analyses",
    color: "text-red-500"
  },
  {
    title: "Paramètres",
    icon: <Settings className="w-5 h-5" />,
    description: "Configurez votre boutique",
    path: "/parametres",
    color: "text-gray-500"
  }
];

export const DashboardNavigation = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all bg-white"
        >
          <div className={`p-3 rounded-lg bg-gray-50 ${item.color}`}>
            {item.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};