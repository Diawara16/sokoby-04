import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Products from "@/pages/Products";
import ProductCatalog from "@/pages/products/ProductCatalog";
import ProductStock from "@/pages/products/ProductStock";
import ProductMovements from "@/pages/products/ProductMovements";
import GiftCards from "@/pages/products/GiftCards";

export const ProductRoutes = () => {
  return (
    <>
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
    </>
  );
};