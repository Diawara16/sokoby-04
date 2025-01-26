import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PrivateRoute from "@/components/PrivateRoute";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Pricing from "@/pages/Pricing";
import Features from "@/pages/Features";
import Resources from "@/pages/Resources";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface PlatformRoutesProps {
  handleSubscribe: (planType: 'starter' | 'pro' | 'enterprise', paymentMethod: 'card' | 'apple_pay' | 'google_pay', couponCode?: string) => Promise<void>;
}

export function PlatformRoutes({ handleSubscribe }: PlatformRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/fonctionnalites" element={<Features />} />
      <Route path="/tarifs" element={<Pricing />} />
      <Route path="/ressources" element={<Resources />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/tableau-de-bord" element={<Dashboard />} />
        <Route path="/parametres" element={<Settings />} />
        <Route path="/profil" element={<Profile />} />
      </Route>
    </Routes>
  );
}