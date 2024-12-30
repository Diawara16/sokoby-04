import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AnalyticsDashboard from "@/pages/analytics/AnalyticsDashboard";
import AnalyticsTrends from "@/pages/analytics/AnalyticsTrends";
import AnalyticsReports from "@/pages/analytics/AnalyticsReports";

export function AnalyticsRoutes() {
  return (
    <>
      <Route
        path="/analyses/tableau-de-bord"
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyses/tendances"
        element={
          <ProtectedRoute>
            <AnalyticsTrends />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyses/rapports"
        element={
          <ProtectedRoute>
            <AnalyticsReports />
          </ProtectedRoute>
        }
      />
    </>
  );
}