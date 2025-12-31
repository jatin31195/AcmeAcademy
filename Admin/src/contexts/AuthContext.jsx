import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/admin/auth/login", { email, password });
      if (res.status === 200) {
        setAdmin({ email });
        return true;
      }
      return false;
    } catch (err) {
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

export const useAuth = () => useContext(AuthContext);
