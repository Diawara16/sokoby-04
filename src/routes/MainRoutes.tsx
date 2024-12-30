import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import QuiSommesNous from "@/pages/QuiSommesNous";

export function MainRoutes() {
  return (
    <>
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
    </>
  );
}