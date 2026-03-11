import { Helmet } from "react-helmet";

interface StoreSEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  storeName?: string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  productAvailability?: boolean;
  type?: "website" | "product";
}

export const StoreSEO = ({
  title,
  description,
  ogImage,
  canonicalUrl,
  storeName,
  productName,
  productPrice,
  productImage,
  productAvailability,
  type = "website",
}: StoreSEOProps) => {
  const pageTitle = title
    ? `${title}${storeName ? ` | ${storeName}` : ""}`
    : storeName || "Sokoby Store";

  const metaDescription =
    description || `Découvrez ${storeName || "notre boutique"} sur Sokoby`;

  const ogImg = ogImage || productImage || "/og-image.png";
  const url = canonicalUrl || window.location.href;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type === "product" ? "product" : "website"} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={storeName || "Sokoby"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImg} />

      {/* Product-specific meta */}
      {type === "product" && productName && (
        <>
          <meta property="product:price:amount" content={String(productPrice || 0)} />
          <meta property="product:price:currency" content="EUR" />
          <meta property="product:availability" content={productAvailability ? "in stock" : "out of stock"} />
        </>
      )}
    </Helmet>
  );
};
