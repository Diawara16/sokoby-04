import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import QuiSommesNous from "@/pages/QuiSommesNous";
import AnalyticsDashboard from "@/pages/analytics/AnalyticsDashboard";
import AnalyticsTrends from "@/pages/analytics/AnalyticsTrends";
import AnalyticsReports from "@/pages/analytics/AnalyticsReports";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AppRoutes() {
  const { isAuthenticated } = useAuthAndProfile();

  return (
    <Routes>
      <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
      
      {/* Main Routes */}
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

      {/* Analytics Routes */}
      <Route
        path="/analytics/dashboard"
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/trends"
        element={
          <ProtectedRoute>
            <AnalyticsTrends />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/reports"
        element={
          <ProtectedRoute>
            <AnalyticsReports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}