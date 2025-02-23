
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import EssaiGratuit from "@/pages/EssaiGratuit";
import { DynamicLanding } from "@/components/landing/DynamicLanding";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/essai-gratuit" element={<EssaiGratuit />} />
      <Route path="/:slug" element={<DynamicLanding />} />
    </Routes>
  );
}
