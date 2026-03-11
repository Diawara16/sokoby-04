import { Helmet } from "react-helmet";

interface ProductJsonLdProps {
  name: string;
  description?: string;
  image?: string;
  price: number;
  currency?: string;
  availability?: boolean;
  url: string;
  storeName?: string;
}

export const ProductJsonLd = ({
  name,
  description,
  image,
  price,
  currency = "EUR",
  availability = true,
  url,
  storeName,
}: ProductJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || name,
    image: image || undefined,
    url,
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: storeName
        ? { "@type": "Organization", name: storeName }
        : undefined,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};
