import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";

function App() {
  const [paypalClientId, setPaypalClientId] = useState<string>("");

  useEffect(() => {
    const fetchPayPalClientId = async () => {
      const { data: { secret } } = await supabase.rpc('get_secret', {
        name: 'PAYPAL_CLIENT_ID'
      });
      if (secret) {
        setPaypalClientId(secret);
      }
    };
    
    fetchPayPalClientId();
  }, []);

  return (
    <BrowserRouter>
      <PayPalScriptProvider options={{ 
        clientId: paypalClientId,
        currency: "EUR"
      }}>
        <AppRoutes />
        <Toaster />
      </PayPalScriptProvider>
    </BrowserRouter>
  );
}

export default App;