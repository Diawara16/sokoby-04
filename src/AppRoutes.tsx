
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import EssaiGratuit from "@/pages/EssaiGratuit";
import { DynamicLanding } from "@/components/landing/DynamicLanding";
import QuiSommesNous from "@/pages/QuiSommesNous";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import Support from "@/pages/Support";
import PlanTarifaire from "@/pages/PlanTarifaire";
import CreerBoutiqueIA from "@/pages/CreerBoutiqueIA";
import Parametres from "@/pages/Parametres";
import Profile from "@/pages/Profile";
import Profil from "@/pages/Profil";
import { SettingsRoutes } from "@/routes/SettingsRoutes";
import AIStore from "@/pages/AIStore";

export function AppRoutes() {
  console.log("AppRoutes rendering avec URL:", window.location.pathname);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/essai-gratuit" element={<EssaiGratuit />} />
      <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/plan-tarifaire" element={<PlanTarifaire />} />
      <Route path="/creer-boutique-ia" element={<CreerBoutiqueIA />} />
      <Route path="/boutique-ia" element={<AIStore />} />
      <Route path="/parametres" element={<Parametres />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/support" element={<Support />} />
      <Route path="/404" element={<div className="min-h-screen flex items-center justify-center">Page non trouvée</div>} />
      <Route path="/:slug" element={<DynamicLanding />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
