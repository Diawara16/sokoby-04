import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Applications from "@/pages/Applications";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductCatalog from "@/pages/products/ProductCatalog";
import ProductStock from "@/pages/products/ProductStock";
import ProductMovements from "@/pages/products/ProductMovements";
import GiftCards from "@/pages/products/GiftCards";
import VenteMulticanale from "@/pages/VenteMulticanale";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tableau-de-bord"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits/catalogue"
        element={
          <ProtectedRoute>
            <ProductCatalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits/stock"
        element={
          <ProtectedRoute>
            <ProductStock />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits/mouvements"
        element={
          <ProtectedRoute>
            <ProductMovements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits/cartes-cadeaux"
        element={
          <ProtectedRoute>
            <GiftCards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vente-multicanale"
        element={
          <ProtectedRoute>
            <VenteMulticanale />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
