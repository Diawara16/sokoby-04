import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QuiSommesNous from "./pages/QuiSommesNous";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
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
        path="/produits"
        element={
          <ProtectedRoute>
            <Products />
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