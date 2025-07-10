import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useQueryConfig } from "@/hooks/useQueryConfig";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CookieConsent } from "@/components/CookieConsent";

function App() {
  console.log("App component rendering"); // Log pour débugger
  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryConfig = useQueryConfig();

  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: queryConfig,
  });

  useEffect(() => {
    const fetchPayPalClientId = async () => {
      try {
        const { data, error } = await supabase.rpc('get_secret', {
          name: 'PAYPAL_CLIENT_ID'
        });
        
        if (error) {
          console.error('Erreur lors de la récupération du secret:', error);
          return;
        }
        
        if (data) {
          setPaypalClientId(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du secret:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayPalClientId();
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <PayPalScriptProvider options={{ 
            clientId: paypalClientId || "test",
            currency: "EUR"
          }}>
            <AppRoutes />
            <CookieConsent />
            <Toaster />
          </PayPalScriptProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
