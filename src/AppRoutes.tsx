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
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Applications from "./pages/Applications";
import CreateStore from "./pages/CreateStore";
import BuyDomain from "./pages/BuyDomain";
import ConnectDomain from "./pages/ConnectDomain";
import DraftOrders from "./pages/orders/DraftOrders";
import ShippingLabels from "./pages/orders/ShippingLabels";
import AbandonedPayments from "./pages/orders/AbandonedPayments";
import ProductCatalog from "./pages/products/ProductCatalog";
import Inventory from "./pages/products/Inventory";
import ProductMovements from "./pages/products/ProductMovements";
import GiftCards from "./pages/products/GiftCards";
import CustomerOverview from "./pages/customers/CustomerOverview";
import CustomerGroups from "./pages/customers/CustomerGroups";
import Loyalty from "./pages/customers/Loyalty";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import Trends from "./pages/analytics/Trends";
import Reports from "./pages/analytics/Reports";

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
      <Route path="/analyses" element={<Analytics />} />
      <Route path="/parametres" element={<Settings />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/creer-boutique-ia" element={<CreateStore />} />
      <Route path="/acheter-domaine" element={<BuyDomain />} />
      <Route path="/connecter-domaine" element={<ConnectDomain />} />

      {/* Orders routes */}
      <Route path="/commandes/provisoires" element={<DraftOrders />} />
      <Route path="/commandes/expeditions" element={<ShippingLabels />} />
      <Route path="/commandes/abandonnes" element={<AbandonedPayments />} />

      {/* Products routes */}
      <Route path="/produits/catalogue" element={<ProductCatalog />} />
      <Route path="/produits/stock" element={<Inventory />} />
      <Route path="/produits/mouvements" element={<ProductMovements />} />
      <Route path="/produits/cartes-cadeaux" element={<GiftCards />} />

      {/* Customers routes */}
      <Route path="/clientele/apercu" element={<CustomerOverview />} />
      <Route path="/clientele/groupes" element={<CustomerGroups />} />
      <Route path="/clientele/fidelisation" element={<Loyalty />} />

      {/* Analytics routes */}
      <Route path="/analyses/tableau-de-bord" element={<AnalyticsDashboard />} />
      <Route path="/analyses/tendances" element={<Trends />} />
      <Route path="/analyses/rapports" element={<Reports />} />
    </Routes>
  );
};

export default AppRoutes;