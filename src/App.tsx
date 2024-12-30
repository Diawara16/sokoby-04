import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "@/AppRoutes";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  const { session, profile } = useAuthAndProfile();
  const isAuthenticated = !!session;

  return (
    <BrowserRouter>
      <LanguageProvider>
        <SidebarProvider>
          <main className="min-h-screen bg-background">
            <div className="relative flex min-h-screen">
              <div className="flex-1">
                <AppRoutes isAuthenticated={isAuthenticated} />
              </div>
            </div>
          </main>
          <Toaster />
        </SidebarProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;