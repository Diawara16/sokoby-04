import { Link } from "react-router-dom";
import { useDynamicLogo } from "@/hooks/useDynamicLogo";

export function Logo() {
  const { logoUrl, loading } = useDynamicLogo();

  if (loading) {
    return (
      <Link to="/" className="flex items-center">
        <div className="h-14 w-32 bg-muted animate-pulse rounded" />
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-center">
      <img 
        src={logoUrl || "/lovable-uploads/a23d77a2-5fb5-4b8d-b354-605dc6969483.png"}
        alt="Sokoby" 
        className="h-14 w-auto"
        width="140"
        height="56"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          console.log('Logo image failed to load:', target.src);
          target.src = "/lovable-uploads/a23d77a2-5fb5-4b8d-b354-605dc6969483.png";
        }}
      />
    </Link>
  );
}