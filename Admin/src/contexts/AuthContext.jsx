import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // REQUIRED
});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Login
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
    } catch (error) {
      console.error("Admin login failed:", error);
      return false;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await api.post("/api/admin/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAdmin(null);
    }
  };

  // ♻️ Restore session on refresh
  const checkAuth = async () => {
    try {
      const res = await api.get("/api/admin/auth/me");
      setAdmin(res.data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false); // 🔥 VERY IMPORTANT
    }
  };

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
        isAuthenticated: !!admin,
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
