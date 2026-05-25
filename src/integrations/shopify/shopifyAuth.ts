// SECURITY NOTE: Shopify OAuth client_secret MUST stay server-side.
// The previous client-side implementation bundled the secret via VITE_SHOPIFY_SECRET
// into the browser, exposing it to any visitor. The exchange must be done in a
// Supabase Edge Function that reads `Deno.env.get('SHOPIFY_SECRET')`.

const clientId = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
const redirectUri = `${window.location.origin}/shopify/callback`;
const scopes = "read_products,write_products,read_orders,write_orders";

// 🔗 Generate Shopify OAuth URL (safe — no secret involved)
export const getShopifyAuthUrl = (shop: string) => {
  return `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
};

// 🔐 Token exchange is intentionally disabled in the browser.
// Move this call to an edge function that holds the Shopify client secret.
export const exchangeShopifyToken = async (_shop: string, _code: string): Promise<string> => {
  throw new Error(
    "Shopify token exchange must be performed server-side. Configure an edge function with SHOPIFY_SECRET and call it from the callback page.",
  );
};
