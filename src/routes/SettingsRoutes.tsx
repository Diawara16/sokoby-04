import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Applications from "@/pages/Applications";
import AIStore from "@/pages/AIStore";
import BuyDomain from "@/pages/BuyDomain";
import ConnectDomain from "@/pages/ConnectDomain";
import Settings from "@/pages/Settings";

export const SettingsRoutes = () => {
  return (
    <>
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
    </>
  );
};