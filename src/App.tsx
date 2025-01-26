import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useQueryConfig } from "@/hooks/useQueryConfig";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  const [paypalClientId, setPaypalClientId] = useState<string>("");
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
          toast({
            title: "Erreur",
            description: "Impossible de récupérer la configuration PayPal",
            variant: "destructive",
          });
          return;
        }
        
        if (data?.secret) {
          setPaypalClientId(data.secret);
        } else {
          toast({
            title: "Configuration manquante",
            description: "L'ID client PayPal n'est pas configuré",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du secret:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la configuration PayPal",
          variant: "destructive",
        });
      }
    };
    
    fetchPayPalClientId();
  }, [toast]);

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PayPalScriptProvider options={{ 
            clientId: paypalClientId || "test",
            currency: "EUR"
          }}>
            <AppRoutes />
            <Toaster />
          </PayPalScriptProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;