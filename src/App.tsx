import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/AppRoutes";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Footer } from "@/components/layout/Footer";

function App() {
  const { session, profile } = useAuthAndProfile();
  const isAuthenticated = !!session;

  return (
    <BrowserRouter>
      <LanguageProvider>
        <SidebarProvider defaultOpen={true}>
          <main className="min-h-screen bg-background">
            <div className="relative flex min-h-screen w-full">
              <div className="flex-1">
                <AppRoutes />
              </div>
            </div>
          </main>
          <Footer />
          <Toaster />
        </SidebarProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;