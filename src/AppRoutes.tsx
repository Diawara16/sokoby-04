
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Pricing from "@/pages/Pricing";
import PlanTarifaire from "@/pages/PlanTarifaire";
import Features from "@/pages/Features";
import Resources from "@/pages/Resources";
import Legal from "@/pages/Legal";
import Accessibility from "@/pages/Accessibility";
import Conditions from "@/pages/Conditions";
import Support from "@/pages/Support";
import Index from "@/pages/Index";
import BoutiqueIA from "@/pages/BoutiqueIA";
import CreerBoutiqueIA from "@/pages/CreerBoutiqueIA";
import CreerBoutiqueManuelle from "@/pages/CreerBoutiqueManuelle";
import ComparisonModeles from "@/pages/ComparisonModeles";
import ShopifyMigration from "@/pages/ShopifyMigration";
import EssaiGratuit from "@/pages/EssaiGratuit";
import QuiSommesNous from "@/pages/QuiSommesNous";
import About from "@/pages/About";
import Marketplace from "@/pages/Marketplace";
import PageEditor from "@/pages/PageEditor";
import ZapierIntegration from "@/pages/ZapierIntegration";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DynamicLanding } from "@/components/landing/DynamicLanding";
import TestSupabase from "@/pages/TestSupabase";
import AuthTest from "@/pages/AuthTest";
import Success from "@/pages/Success";
import GestionCompte from "@/pages/GestionCompte";
import UpdatePassword from "@/pages/UpdatePassword";
import Boutique from "@/pages/Boutique";
import AddProduct from "@/pages/products/AddProduct";
import ImportProducts from "@/pages/products/ImportProducts";
import Products from "@/pages/Products";
import ProductCatalog from "@/pages/products/ProductCatalog";
import ProductStock from "@/pages/products/ProductStock";
import ProductMovements from "@/pages/products/ProductMovements";
import GiftCards from "@/pages/products/GiftCards";
import StoreEditor from "@/pages/StoreEditor";
import StorePreview from "@/pages/boutique/StorePreview";
import Applications from "@/pages/Applications";

export function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    // Track page views or other analytics here if needed
    console.log('Current route:', location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/index" element={<Index />} />
      <Route path="/boutique-ia" element={<BoutiqueIA />} />
      <Route path="/creer-boutique-ia" element={<CreerBoutiqueIA />} />
      <Route path="/creer-boutique-manuelle" element={
        <ProtectedRoute>
          <CreerBoutiqueManuelle />
        </ProtectedRoute>
      } />
      <Route path="/comparaison-modeles" element={<ComparisonModeles />} />
      
      {/* Migration routes - main and platform-specific */}
      <Route path="/migration-shopify" element={<ShopifyMigration />} />
      <Route path="/migration-woocommerce" element={<ShopifyMigration />} />
      <Route path="/migration-bigcommerce" element={<ShopifyMigration />} />
      <Route path="/migration-squarespace" element={<ShopifyMigration />} />
      <Route path="/migration-magento" element={<ShopifyMigration />} />
      <Route path="/migration-volusion" element={<ShopifyMigration />} />
      
      {/* French and English routes for authentication */}
      <Route path="/connexion" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/nouveau-mot-de-passe" element={<ResetPassword />} />
      <Route path="/modifier-mot-de-passe" element={
        <ProtectedRoute>
          <UpdatePassword />
        </ProtectedRoute>
      } />
      
      {/* Trial and about pages */}
      <Route path="/essai-gratuit" element={<EssaiGratuit />} />
      <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
      <Route path="/about" element={<About />} />
      <Route path="/a-propos" element={<About />} />
      
      <Route path="/fonctionnalites" element={<Features />} />
      <Route path="/features" element={<Features />} />
      <Route path="/tarifs" element={<Pricing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/plan-tarifaire" element={<PlanTarifaire />} />
      <Route path="/ressources" element={<Resources />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/conditions" element={<Conditions />} />
      <Route path="/support" element={<Support />} />
      <Route path="/success" element={<Success />} />
      <Route path="/test-supabase" element={<TestSupabase />} />
      <Route path="/auth-test" element={<AuthTest />} />
      
      {/* New platform features */}
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/extensions" element={<Marketplace />} />
      <Route path="/editeur-pages" element={
        <ProtectedRoute>
          <PageEditor />
        </ProtectedRoute>
      } />
      <Route path="/zapier" element={
        <ProtectedRoute>
          <ZapierIntegration />
        </ProtectedRoute>
      } />
      <Route path="/integrations-zapier" element={
        <ProtectedRoute>
          <ZapierIntegration />
        </ProtectedRoute>
      } />
      
      <Route path="/tableau-de-bord" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/parametres" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/profil" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/gestion-compte" element={
        <ProtectedRoute>
          <GestionCompte />
        </ProtectedRoute>
      } />
      
      {/* Boutique and Products routes */}
      <Route path="/boutique" element={<Boutique />} />
      <Route path="/boutique-editeur" element={
        <ProtectedRoute>
          <StoreEditor />
        </ProtectedRoute>
      } />
      <Route path="/boutique-apercu/:storeId" element={<StorePreview />} />
      <Route path="/store-editor" element={
        <ProtectedRoute>
          <StoreEditor />
        </ProtectedRoute>
      } />
      <Route path="/products/add" element={
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      } />
      <Route path="/products/import" element={
        <ProtectedRoute>
          <ImportProducts />
        </ProtectedRoute>
      } />
      
      {/* Product management routes */}
      <Route path="/produits" element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      } />
      <Route path="/produits/catalogue" element={
        <ProtectedRoute>
          <ProductCatalog />
        </ProtectedRoute>
      } />
      <Route path="/produits/stock" element={
        <ProtectedRoute>
          <ProductStock />
        </ProtectedRoute>
      } />
      <Route path="/produits/mouvements" element={
        <ProtectedRoute>
          <ProductMovements />
        </ProtectedRoute>
      } />
      <Route path="/produits/cartes-cadeaux" element={
        <ProtectedRoute>
          <GiftCards />
        </ProtectedRoute>
      } />
      
      {/* Applications route */}
      <Route path="/applications" element={
        <ProtectedRoute>
          <Applications />
        </ProtectedRoute>
      } />
      <Route path="/apps" element={
        <ProtectedRoute>
          <Applications />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route for dynamic landing pages */}
      <Route path="/:slug" element={<DynamicLanding />} />
    </Routes>
  );
}
