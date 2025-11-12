import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { exchangeShopifyToken, initializeShopifyClient } from "@/integrations/shopify";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ShopifyCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing Shopify connection...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const shop = searchParams.get("shop");
        const state = searchParams.get("state");

        if (!code || !shop) {
          throw new Error("Missing OAuth parameters");
        }

        setStatus("Exchanging authorization code...");
        
        // Exchange code for access token
        const accessToken = await exchangeShopifyToken(shop, code);

        setStatus("Saving Shopify credentials...");

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Save Shopify credentials to database
        const { error: upsertError } = await supabase
          .from("store_settings")
          .update({
            shopify_shop_domain: shop,
            shopify_access_token: accessToken,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (upsertError) throw upsertError;

        // Initialize Shopify client
        initializeShopifyClient({
          shop,
          accessToken,
        });

        setStatus("Redirecting to checkout...");

        // Decode state to get checkout info
        const checkoutData = state ? JSON.parse(atob(state)) : null;

        if (checkoutData?.checkoutUrl) {
          // Redirect to Shopify checkout
          window.location.href = checkoutData.checkoutUrl;
        } else {
          // No checkout, go to dashboard
          toast.success("Shopify store connected successfully!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Shopify callback error:", error);
        toast.error("Failed to connect Shopify store");
        navigate("/dashboard");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-lg text-foreground">{status}</p>
      </div>
    </div>
  );
};

export default ShopifyCallback;
