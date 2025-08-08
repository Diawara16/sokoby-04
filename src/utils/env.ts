export const isPreviewEnv = (): boolean => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname || "";
  // Treat Lovable preview/builder domains as non-production preview environments
  return (
    host.includes("preview--") ||
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovableproject.com") ||
    host.includes("lovable.app") ||
    host.includes("lovableproject.com")
  );
};
