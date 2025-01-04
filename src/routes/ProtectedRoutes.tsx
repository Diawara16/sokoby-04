import { Navigate, Outlet } from "react-router-dom";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

export const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuthAndProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  return <Outlet />;
};