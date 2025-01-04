import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Orders from "@/pages/Orders";
import Products from "@/pages/Products";
import Analytics from "@/pages/analytics/Analytics";
import AnalyticsTrends from "@/pages/analytics/AnalyticsTrends";
import AnalyticsReports from "@/pages/analytics/AnalyticsReports";
import CustomReports from "@/pages/analytics/CustomReports";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Applications from "@/pages/Applications";
import AIStore from "@/pages/AIStore";
import SmartLogistics from "@/pages/logistics/SmartLogistics";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
      <Route path="/creer-boutique-ia" element={<ProtectedRoute><AIStore /></ProtectedRoute>} />
      <Route path="/logistics" element={<ProtectedRoute><SmartLogistics /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/analytics/trends" element={<ProtectedRoute><AnalyticsTrends /></ProtectedRoute>} />
      <Route path="/analytics/reports" element={<ProtectedRoute><AnalyticsReports /></ProtectedRoute>} />
      <Route path="/analytics/custom-reports" element={<ProtectedRoute><CustomReports /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;