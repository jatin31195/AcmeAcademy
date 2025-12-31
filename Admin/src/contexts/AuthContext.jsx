import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const AuthContext = createContext(null);

/* =======================
   AXIOS INSTANCE
======================= */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

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
            setAdmin(null);
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
        setAdmin({ email });
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
      setAdmin(null);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await api.get("/api/admin/auth/me");
      setAdmin(res.data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     RESTORE SESSION
  ======================= */
  useEffect(() => {
    checkAuth();
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
