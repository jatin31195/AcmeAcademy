import { Navigate, useLocation ,Outlet} from "react-router-dom";
import { useAuth } from "../AuthContext";


export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
