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
import CreerBoutiqueIA from "@/pages/CreerBoutiqueIA";
import EmailMarketing from "@/pages/EmailMarketing";
import { ProtectedRoutes } from "@/routes/ProtectedRoutes";
import StoreSettings from "@/pages/settings/StoreSettings";
import PaymentSettings from "@/pages/settings/PaymentSettings";
import LocationSettings from "@/pages/settings/LocationSettings";
import SecuritySettings from "@/pages/settings/SecuritySettings";
import UserSettings from "@/pages/settings/UserSettings";

const AppRoutes = () => {
  const protectedRoutes = [
    { path: "/", element: <Dashboard /> },
    { path: "/profile", element: <Profile /> },
    { path: "/settings", element: <Settings /> },
    { path: "/settings/general", element: <StoreSettings /> },
    { path: "/settings/domaine", element: <StoreSettings showDomainOnly /> },
    { path: "/settings/utilisateurs", element: <UserSettings /> },
    { path: "/settings/paiements", element: <PaymentSettings /> },
    { path: "/settings/geolocalisation", element: <LocationSettings /> },
    { path: "/settings/securite", element: <SecuritySettings /> },
    { path: "/orders", element: <Orders /> },
    { path: "/products", element: <Products /> },
    { path: "/products/add", element: <AddProduct /> },
    { path: "/applications", element: <Applications /> },
    { path: "/email-marketing", element: <EmailMarketing /> },
    { path: "/creer-boutique-ia", element: <CreerBoutiqueIA /> },
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