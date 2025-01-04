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

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/trends" element={<AnalyticsTrends />} />
        <Route path="/analytics/reports" element={<AnalyticsReports />} />
        <Route path="/analytics/custom-reports" element={<CustomReports />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;