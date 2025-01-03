import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import QuiSommesNous from "./pages/QuiSommesNous"
import Orders from "./pages/Orders"
import OrderDetails from "./pages/OrderDetails"
import Fidelite from "./pages/Fidelite"
import BlogManager from "./pages/BlogManager"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"
import CustomReports from "./pages/analytics/CustomReports"
import { DynamicLanding } from "./components/landing/DynamicLanding"
import EmailMarketing from "./pages/EmailMarketing"
import CustomerRecommendations from "./pages/CustomerRecommendations"
import SmartLogistics from "./pages/logistics/SmartLogistics"
import Boutique from "./pages/Boutique"
import Products from "./pages/Products"
import ImportedProducts from "./pages/products/ImportedProducts"
import AddImportedProduct from "./pages/products/AddImportedProduct"
import AddProduct from "./pages/products/AddProduct"
import Settings from "./pages/Settings"
import BillingSettings from "./pages/settings/BillingSettings"
import UserSettings from "./pages/settings/UserSettings"
import PaymentSettings from "./pages/settings/PaymentSettings"
import LocationSettings from "./pages/settings/LocationSettings"
import CustomerOverview from "./pages/customers/CustomerOverview"
import CustomerDetails from "./pages/customers/CustomerDetails"
import CustomerGroups from "./pages/customers/CustomerGroups"
import CustomerLoyalty from "./pages/customers/CustomerLoyalty"
import Applications from "./pages/Applications"
import AIStore from "./pages/AIStore"
import VenteMulticanale from "./pages/VenteMulticanale"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tableau-de-bord" element={<Dashboard />} />
      <Route path="/profil" element={<Profile />} />
      <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
      <Route path="/suivi-commande" element={<Orders />} />
      <Route path="/commande/:id" element={<OrderDetails />} />
      <Route path="/fidelite" element={<Fidelite />} />
      <Route path="/blog-manager" element={<BlogManager />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/rapports-personnalises" element={<CustomReports />} />
      <Route path="/email-marketing" element={<EmailMarketing />} />
      <Route path="/recommandations" element={<CustomerRecommendations />} />
      <Route path="/logistique" element={<SmartLogistics />} />
      <Route path="/boutique" element={<Boutique />} />
      <Route path="/produits" element={<Products />} />
      <Route path="/produits/ajouter" element={<AddProduct />} />
      <Route path="/produits/importes" element={<ImportedProducts />} />
      <Route path="/produits/importes/ajouter" element={<AddImportedProduct />} />
      <Route path="/clients/vue-ensemble" element={<CustomerOverview />} />
      <Route path="/clients/details" element={<CustomerDetails />} />
      <Route path="/clients/groupes" element={<CustomerGroups />} />
      <Route path="/clients/fidelite" element={<CustomerLoyalty />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/creer-boutique-ia" element={<AIStore />} />
      <Route path="/vente-multicanale" element={<VenteMulticanale />} />
      <Route path="/parametres" element={<Settings />}>
        <Route path="facturation" element={<BillingSettings />} />
        <Route path="utilisateurs" element={<UserSettings />} />
        <Route path="paiements" element={<PaymentSettings />} />
        <Route path="geolocalisation" element={<LocationSettings />} />
      </Route>
      <Route path="/:slug" element={<DynamicLanding />} />
    </Routes>
  )
}