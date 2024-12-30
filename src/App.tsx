import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import CreerBoutiqueIA from "@/pages/CreerBoutiqueIA";
import AcheterDomaine from "@/pages/AcheterDomaine";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

function App() {
  const { isAuthenticated } = useAuthAndProfile();

  return (
    <Router>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
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
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;