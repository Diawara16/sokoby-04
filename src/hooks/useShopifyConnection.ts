import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getShopifyAuthUrl } from "@/integrations/shopify";
import { toast } from "sonner";

export const useShopifyConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectShopify = async (shopDomain: string, checkoutUrl?: string) => {
    setIsConnecting(true);
    try {
      // Validate shop domain
      const cleanDomain = shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      if (!cleanDomain.includes('.myshopify.com') && !cleanDomain.includes('.')) {
        throw new Error("Please enter a valid Shopify domain (e.g., your-store.myshopify.com)");
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Generate OAuth URL
      const authUrl = getShopifyAuthUrl(cleanDomain);
      
      // Redirect to Shopify OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("Shopify connection error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect Shopify store");
      setIsConnecting(false);
    }
  };

  const initiateStoreCreation = async (formData: {
    name: string;
    email: string;
    phone: string;
    niche: string;
    plan: string;
    shopifyShop: string;
  }) => {
    setIsConnecting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Call init-store edge function
      const { data, error } = await supabase.functions.invoke('init-store', {
        body: formData,
      });

      if (error) throw error;

      // Redirect to Shopify OAuth (which will then redirect to checkout)
      if (data.shopifyAuthUrl) {
        window.location.href = data.shopifyAuthUrl;
      } else {
        throw new Error("No Shopify auth URL received");
      }
    } catch (error) {
      console.error("Store creation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to initialize store creation");
      setIsConnecting(false);
    }
  };

  return {
    isConnecting,
    connectShopify,
    initiateStoreCreation,
  };
};
