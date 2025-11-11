const clientId = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SHOPIFY_SECRET;
const redirectUri = import.meta.env.VITE_SHOPIFY_REDIRECT_URI;
const scopes = "read_products,write_products,read_orders,write_orders";

// 🔗 Generate Shopify OAuth URL
export const getShopifyAuthUrl = (shop: string) => {
  return `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
};

// 🔐 Exchange authorization code for access token
export const exchangeShopifyToken = async (shop: string, code: string) => {
  const url = `https://${shop}/admin/oauth/access_token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Shopify token");
  }

  const data = await response.json();
  return data.access_token;
};
