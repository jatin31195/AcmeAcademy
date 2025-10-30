import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/home" replace />;

  return <Outlet />;
};

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
