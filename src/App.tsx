import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import PlanTarifaire from "@/pages/PlanTarifaire";
import Contact from "@/pages/Contact";
import Conditions from "@/pages/Conditions";
import Guides from "@/pages/Guides";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import Legal from "@/pages/Legal";
import Accessibility from "@/pages/Accessibility";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";
import Configuration from "@/pages/Configuration";
import Dashboard from "@/pages/Dashboard";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Parametres from "@/pages/Parametres";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col bg-white">
          <Header isAuthenticated={!!user} />
          <main className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<Home isAuthenticated={!!user} />} />
              <Route path="/plan-tarifaire" element={<PlanTarifaire />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/conditions" element={<Conditions />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/tableau-de-bord" element={<Dashboard />} />
              <Route path="/parametres" element={<Parametres />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;