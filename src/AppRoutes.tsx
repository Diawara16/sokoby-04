import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import CreerBoutiqueIA from "@/pages/CreerBoutiqueIA";
import AcheterDomaine from "@/pages/AcheterDomaine";
import ConnecterDomaine from "@/pages/ConnecterDomaine";
import Onboarding from "@/pages/Onboarding";
import { AppSidebar } from "@/components/AppSidebar";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
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
            path="/profil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creer-boutique-ia"
            element={
              <ProtectedRoute>
                <CreerBoutiqueIA />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acheter-domaine"
            element={
              <ProtectedRoute>
                <AcheterDomaine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connecter-domaine"
            element={
              <ProtectedRoute>
                <ConnecterDomaine />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};