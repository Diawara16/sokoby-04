import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { MainRoutes } from "./routes/MainRoutes";
import { OrderRoutes } from "./routes/OrderRoutes";
import { ProductRoutes } from "./routes/ProductRoutes";
import { CustomerRoutes } from "./routes/CustomerRoutes";
import { AnalyticsRoutes } from "./routes/AnalyticsRoutes";
import { SettingsRoutes } from "./routes/SettingsRoutes";

export default function AppRoutes() {
  const { isAuthenticated } = useAuthAndProfile();

  return (
    <Routes>
      <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
      <MainRoutes />
      <OrderRoutes />
      <ProductRoutes />
      <CustomerRoutes />
      <AnalyticsRoutes />
      <SettingsRoutes />
    </Routes>
  );
}