import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Only block on the loading screen while we genuinely don't know yet.
  // If the admin is already authenticated (e.g. just logged in), render the
  // app immediately — never get stuck on the spinner.
  if (loading && !isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Verifying secure session...
      </div>
    );
  }

  // 🔐 Not authenticated → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

 
  return children;
};

export default ProtectedRoute;
