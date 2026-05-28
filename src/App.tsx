import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider } from "react-redux";
import { store } from "@/store";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQueryConfig } from "@/hooks/useQueryConfig";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CookieConsent } from "@/components/CookieConsent";

function App() {
  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const queryConfig = useQueryConfig();

  // Memoize the QueryClient so it isn't recreated on every render
  // (re-creation wipes the cache and triggers a refetch storm).
  const queryClient = useMemo(
    () => new QueryClient({ defaultOptions: queryConfig }),
    // queryConfig is a stable shape; intentionally created once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
        if (data) setPaypalClientId(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du secret:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayPalClientId();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Provider store={store}>
      <LanguageProvider>
        <CurrencyProvider>
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
        </CurrencyProvider>
      </LanguageProvider>
    </Provider>
  );
}

export default App;
