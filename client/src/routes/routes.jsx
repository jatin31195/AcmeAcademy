import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/home" replace />;

  return <Outlet />;
};

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation(); 

  if (loading) return <div>Loading...</div>;

  if (!user) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
