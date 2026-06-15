import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const AuthContext = createContext(null);

/* =======================
   AXIOS INSTANCE
======================= */
// Exported so feature components can share the SAME instance and benefit from
// the 401 auto-refresh interceptor below (instead of using bare fetch()).
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const INACTIVITY_MS = 30 * 60 * 1000;
const REVALIDATE_MS = 5 * 60 * 1000;
// Server access-token lifetime (keep in sync with authController.js).
const ACCESS_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
// Silently renew the access token well before it expires so the session never
// lapses mid-use. Refreshing at half the TTL guarantees a fresh token even if
// the tab sleeps for a while, and it's completely invisible to the admin
// (no loading screen, no redirect — just a quiet background POST /refresh).
const PROACTIVE_REFRESH_MS = ACCESS_TOKEN_TTL_MS / 2;

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef(null);

  // Prevent multiple refresh calls
  const isRefreshing = useRef(false);
  const failedQueue = useRef([]);

  const processQueue = (error) => {
    failedQueue.current.forEach((p) =>
      error ? p.reject(error) : p.resolve()
    );
    failedQueue.current = [];
  };

  /* =======================
     AXIOS INTERCEPTOR
  ======================= */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Never run the refresh-retry logic for the refresh call itself.
        // Otherwise a 401 from /refresh re-enters this handler and gets queued
        // waiting on the very refresh in progress → deadlock (the session
        // check then hangs on "Verifying secure session...").
        if (originalRequest?.url?.includes("/api/admin/auth/refresh")) {
          return Promise.reject(error);
        }

        // If access token expired
        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          if (isRefreshing.current) {
            // Queue requests while refresh in progress
            return new Promise((resolve, reject) => {
              failedQueue.current.push({ resolve, reject });
            }).then(() => api(originalRequest));
          }

          originalRequest._retry = true;
          isRefreshing.current = true;

          try {
            // 🔄 Refresh access token
            await api.post("/api/admin/auth/refresh");

            processQueue(null);
            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError);
            // Only sign out when the refresh token is genuinely rejected.
            // Transient failures (network / timeout / 5xx) must NOT end a
            // session that still holds valid cookies.
            if (refreshError?.response?.status === 401) {
              setAdmin(null);
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing.current = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const startInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(async () => {
      try {
        await api.post("/api/admin/auth/logout");
      } catch {
        // ignore logout error on timeout
      } finally {
        setAdmin(null);
      }
    }, INACTIVITY_MS);
  };

  useEffect(() => {
    if (!admin) {
      clearInactivityTimer();
      return;
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    const onActivity = () => startInactivityTimer();

    events.forEach((eventName) => window.addEventListener(eventName, onActivity, { passive: true }));
    startInactivityTimer();

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, onActivity));
      clearInactivityTimer();
    };
  }, [admin]);

  useEffect(() => {
    if (!admin) return;

    const intervalId = setInterval(() => {
      checkAuth();
    }, REVALIDATE_MS);

    return () => clearInterval(intervalId);
  }, [admin]);

  /* =======================
     PROACTIVE TOKEN REFRESH
     Renew the 15-min access token before it expires, and again whenever the
     admin returns to the tab. Prevents the intermittent "logged out" issue.
  ======================= */
  useEffect(() => {
    if (!admin) return;

    const refresh = async () => {
      try {
        await api.post("/api/admin/auth/refresh");
      } catch {
        // If refresh fails (e.g. refresh token truly expired), revalidate;
        // the interceptor / checkAuth will then sign out cleanly.
        checkAuth();
      }
    };

    const intervalId = setInterval(refresh, PROACTIVE_REFRESH_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", refresh);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", refresh);
    };
  }, [admin]);

  /* =======================
     AUTH METHODS
  ======================= */

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/admin/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        setAdmin(res.data?.admin || { email });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/admin/auth/logout");
    } finally {
      clearInactivityTimer();
      setAdmin(null);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await api.get("/api/admin/auth/me");
      setAdmin(res.data.admin);
    } catch (err) {
      // Background revalidation: only log out on a definitive auth rejection.
      // A transient error should leave the existing session untouched so the
      // admin isn't bounced to /login on a momentary blip.
      if (err?.response?.status === 401) {
        setAdmin(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     RESTORE SESSION
     On first load, keep the "Verifying secure session..." screen up while we
     confirm auth. Distinguish a real 401 (→ login) from a transient error
     (→ retry a few times) so a valid session never flashes the login page.
  ======================= */
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async (attempt = 0) => {
      try {
        const res = await api.get("/api/admin/auth/me");
        if (cancelled) return;
        setAdmin(res.data.admin);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        const status = err?.response?.status;
        const isTransient = !status || status >= 500; // network / timeout / 5xx

        if (isTransient && attempt < 3) {
          // Stay on the loading screen and retry with simple backoff.
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          if (!cancelled) bootstrap(attempt + 1);
          return;
        }

        // Definitive 401 (or exhausted retries) → treat as logged out.
        setAdmin(null);
        setLoading(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading,
        isAuthenticated: Boolean(admin),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
