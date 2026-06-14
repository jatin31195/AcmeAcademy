import { Navigate } from "react-router-dom";
import { RP_BASE } from "./constants.js";

/**
 * Route guard for the NIMCET Rank Predictor flow.
 * Auth here is the phone-OTP session (sessionStorage "rp_auth"), which is
 * separate from the main site login — a visitor verifies their phone via OTP
 * to access the form/report, without needing an ACME account.
 */
const RankProtectedRoute = ({ children }) => {
  const authData = sessionStorage.getItem("rp_auth");

  if (!authData) {
    return <Navigate to={RP_BASE} replace />;
  }

  try {
    const { phone, expiry } = JSON.parse(authData);
    if (!phone || new Date().getTime() > expiry) {
      sessionStorage.removeItem("rp_auth");
      return <Navigate to={RP_BASE} replace />;
    }
  } catch {
    sessionStorage.removeItem("rp_auth");
    return <Navigate to={RP_BASE} replace />;
  }

  return children;
};

export default RankProtectedRoute;
