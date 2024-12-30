import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QuiSommesNous from "./pages/QuiSommesNous";
import Orders from "./pages/Orders";
import DraftOrders from "./pages/DraftOrders";
import ShippingLabels from "./pages/ShippingLabels";
import AbandonedCheckouts from "./pages/AbandonedCheckouts";
import Products from "./pages/Products";
import ProductCatalog from "./pages/products/ProductCatalog";
import ProductStock from "./pages/products/ProductStock";
import ProductMovements from "./pages/products/ProductMovements";
import GiftCards from "./pages/products/GiftCards";
import Customers from "./pages/Customers";
import CustomerOverview from "./pages/customers/CustomerOverview";
import CustomerGroups from "./pages/customers/CustomerGroups";
import CustomerLoyalty from "./pages/customers/CustomerLoyalty";
import Applications from "./pages/Applications";
import AIStore from "./pages/AIStore";
import BuyDomain from "./pages/BuyDomain";
import ConnectDomain from "./pages/ConnectDomain";
import Settings from "./pages/Settings";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

export default function AppRoutes() {
  const { isAuthenticated } = useAuthAndProfile();

  return (
    <Routes>
      <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
      <Route
        path="/tableau-de-bord"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qui-sommes-nous"
        element={
          <ProtectedRoute>
            <QuiSommesNous />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/provisoires"
        element={
          <ProtectedRoute>
            <DraftOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/expeditions"
        element={
          <ProtectedRoute>
            <ShippingLabels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/abandonnes"
        element={
          <ProtectedRoute>
            <AbandonedCheckouts />
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
        path="/clientele"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientele/apercu"
        element={
          <ProtectedRoute>
            <CustomerOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientele/groupes"
        element={
          <ProtectedRoute>
            <CustomerGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientele/fidelisation"
        element={
          <ProtectedRoute>
            <CustomerLoyalty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creer-boutique-ia"
        element={
          <ProtectedRoute>
            <AIStore />
          </ProtectedRoute>
        }
      />
      <Route
        path="/acheter-domaine"
        element={
          <ProtectedRoute>
            <BuyDomain />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connecter-domaine"
        element={
          <ProtectedRoute>
            <ConnectDomain />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parametres"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
