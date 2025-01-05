import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Orders from "@/pages/Orders";
import Products from "@/pages/Products";
import AddProduct from "@/pages/products/AddProduct";
import Analytics from "@/pages/analytics/Analytics";
import AnalyticsTrends from "@/pages/analytics/AnalyticsTrends";
import AnalyticsReports from "@/pages/analytics/AnalyticsReports";
import CustomReports from "@/pages/analytics/CustomReports";
import Applications from "@/pages/Applications";
import AIStore from "@/pages/AIStore";
import SmartLogistics from "@/pages/logistics/SmartLogistics";
import VenteMulticanale from "@/pages/VenteMulticanale";
import Integrations from "@/pages/Integrations";
import Boutique from "@/pages/Boutique";
import { ProtectedRoutes } from "@/routes/ProtectedRoutes";

const AppRoutes = () => {
  const protectedRoutes = [
    { path: "/", element: <Dashboard /> },
    { path: "/profile", element: <Profile /> },
    { path: "/settings", element: <Settings /> },
    { path: "/orders", element: <Orders /> },
    { path: "/products", element: <Products /> },
    { path: "/products/add", element: <AddProduct /> },
    { path: "/applications", element: <Applications /> },
    { path: "/creer-boutique-ia", element: <AIStore /> },
    { path: "/logistics", element: <SmartLogistics /> },
    { path: "/vente-multicanale", element: <VenteMulticanale /> },
    { path: "/integrations", element: <Integrations /> },
    { path: "/analytics", element: <Analytics /> },
    { path: "/analytics/trends", element: <AnalyticsTrends /> },
    { path: "/analytics/reports", element: <AnalyticsReports /> },
    { path: "/analytics/custom-reports", element: <CustomReports /> },
    { path: "/boutique", element: <Boutique /> },
  ];

  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        {protectedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;