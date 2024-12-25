import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CartProvider } from "@/components/cart/CartContext";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Boutique from "./pages/Boutique";
import Profil from "./pages/Profil";
import Parametres from "./pages/Parametres";
import Onboarding from "./pages/Onboarding";
import Applications from "./pages/Applications";
import PlanTarifaire from "./pages/PlanTarifaire";
import Domicile from "./pages/Domicile";
import Environ from "./pages/Environ";
import Services from "./pages/Services";
import Themes from "./pages/Themes";
import Contact from "./pages/Contact";
import EssaiGratuit from "./pages/EssaiGratuit";
import Confidentialite from "./pages/Confidentialite";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <div className="min-h-screen bg-background font-sans">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/boutique" element={<Boutique />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/parametres" element={<Parametres />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/plan-tarifaire" element={<PlanTarifaire />} />
                    <Route path="/domicile" element={<Domicile />} />
                    <Route path="/environ" element={<Environ />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/themes" element={<Themes />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/essai-gratuit" element={<EssaiGratuit />} />
                    <Route path="/confidentialite" element={<Confidentialite />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </div>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;