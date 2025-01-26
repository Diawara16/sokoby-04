import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/a23d77a2-5fb5-4b8d-b354-605dc6969483.png" 
        alt="Sokoby" 
        className="h-14 w-auto"
        width="140"
        height="56"
      />
    </Link>
  );
}