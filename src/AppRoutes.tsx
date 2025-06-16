
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Pricing from "@/pages/Pricing";
import Features from "@/pages/Features";
import Resources from "@/pages/Resources";
import Legal from "@/pages/Legal";
import Accessibility from "@/pages/Accessibility";
import Conditions from "@/pages/Conditions";
import Support from "@/pages/Support";
import Index from "@/pages/Index";
import BoutiqueIA from "@/pages/BoutiqueIA";
import CreerBoutiqueIA from "@/pages/CreerBoutiqueIA";
import ComparisonModeles from "@/pages/ComparisonModeles";
import ShopifyMigration from "@/pages/ShopifyMigration";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DynamicLanding } from "@/components/landing/DynamicLanding";

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
      
      {/* Migration routes - main and platform-specific */}
      <Route path="/migration-shopify" element={<ShopifyMigration />} />
      <Route path="/migration-woocommerce" element={<ShopifyMigration />} />
      <Route path="/migration-bigcommerce" element={<ShopifyMigration />} />
      <Route path="/migration-squarespace" element={<ShopifyMigration />} />
      <Route path="/migration-magento" element={<ShopifyMigration />} />
      <Route path="/migration-volusion" element={<ShopifyMigration />} />
      
      <Route path="/connexion" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/fonctionnalites" element={<Features />} />
      <Route path="/features" element={<Features />} />
      <Route path="/tarifs" element={<Pricing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/ressources" element={<Resources />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/conditions" element={<Conditions />} />
      <Route path="/support" element={<Support />} />
      
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
      
      {/* Catch-all route for dynamic landing pages */}
      <Route path="/:slug" element={<DynamicLanding />} />
    </Routes>
  );
}
