import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen w-full">
              <AppRoutes />
              <Toaster />
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;