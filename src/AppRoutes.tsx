
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import EssaiGratuit from "@/pages/EssaiGratuit";
import { DynamicLanding } from "@/components/landing/DynamicLanding";

export function AppRoutes() {
  console.log("AppRoutes rendering avec URL:", window.location.pathname); // Log amélioré
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/essai-gratuit" element={<EssaiGratuit />} />
      <Route path="/404" element={<div className="min-h-screen flex items-center justify-center">Page non trouvée</div>} />
      <Route path="/:slug" element={<DynamicLanding />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
