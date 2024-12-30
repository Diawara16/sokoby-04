import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AnalyticsDashboard from "@/pages/analytics/AnalyticsDashboard";
import AnalyticsTrends from "@/pages/analytics/AnalyticsTrends";
import AnalyticsReports from "@/pages/analytics/AnalyticsReports";

export function AnalyticsRoutes() {
  return (
    <>
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
    </>
  );
}