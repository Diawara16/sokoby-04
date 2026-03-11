/**
 * Generate a URL-friendly slug from a string.
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Build a product URL using its slug.
 */
export const getProductUrl = (slug: string): string => {
  return `/products/${slug}`;
};

/**
 * Build a full canonical URL for a product.
 */
export const getProductCanonicalUrl = (slug: string, domain?: string): string => {
  const base = domain ? `https://${domain}` : window.location.origin;
  return `${base}/products/${slug}`;
};
