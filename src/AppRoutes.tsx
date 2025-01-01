import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QuiSommesNous from "./pages/QuiSommesNous";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import Applications from "./pages/Applications";
import BuyDomain from "./pages/BuyDomain";
import ConnectDomain from "./pages/ConnectDomain";
import ProductCatalog from "./pages/products/ProductCatalog";
import ProductMovements from "./pages/products/ProductMovements";
import GiftCards from "./pages/products/GiftCards";
import CustomerOverview from "./pages/customers/CustomerOverview";
import CustomerGroups from "./pages/customers/CustomerGroups";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tableau-de-bord" element={<Dashboard />} />
      <Route path="/profil" element={<Profile />} />
      <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
      <Route path="/produits" element={<Products />} />
      <Route path="/commandes" element={<Orders />} />
      <Route path="/clientele" element={<Customers />} />
      <Route path="/parametres" element={<Settings />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/acheter-domaine" element={<BuyDomain />} />
      <Route path="/connecter-domaine" element={<ConnectDomain />} />

      {/* Products routes */}
      <Route path="/produits/catalogue" element={<ProductCatalog />} />
      <Route path="/produits/mouvements" element={<ProductMovements />} />
      <Route path="/produits/cartes-cadeaux" element={<GiftCards />} />

      {/* Customers routes */}
      <Route path="/clientele/apercu" element={<CustomerOverview />} />
      <Route path="/clientele/groupes" element={<CustomerGroups />} />

      {/* Analytics routes */}
      <Route path="/analyses/tableau-de-bord" element={<AnalyticsDashboard />} />
    </Routes>
  );
};

export default AppRoutes;