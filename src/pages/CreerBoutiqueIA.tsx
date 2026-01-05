import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// AI store creation is disabled - all stores are now LIVE production stores
const CreerBoutiqueIA = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard - AI creation is disabled for live stores
    navigate("/tableau-de-bord", { replace: true });
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    </div>
  );
};

export default CreerBoutiqueIA;
