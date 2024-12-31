import { Navigate } from "react-router-dom";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthAndProfile();

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;