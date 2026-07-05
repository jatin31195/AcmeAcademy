"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { BASE_URL } from "@/lib/config";

// Minimal, behavior-faithful port of client/src/AuthContext.jsx — just
// enough for Navbar's logged-in/logged-out state to behave identically in
// Phase 1. Full auth architecture (server-side session read, middleware,
// consolidated refresh-on-401 shared with UserContext, cookie-forwarding
// for Server Components) is out of Phase 1 scope per the migration
// blueprint and lands in the later Context/Auth phase — that phase absorbs
// this file rather than replacing it from scratch.

type AuthUser = {
  initials?: string;
  fullname?: string;
  [key: string]: unknown;
} | null;

type AuthContextValue = {
  user: AuthUser;
  login: (userData: AuthUser) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<AuthUser>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (): Promise<AuthUser> => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      }

      if (res.status === 401) {
        console.warn("Access token expired — trying refresh...");
        const refreshRes = await fetch(`${BASE_URL}/api/users/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          const { user: refreshedUser } = await refreshRes.json();
          setUser(refreshedUser);
          return refreshedUser;
        } else {
          console.warn("Refresh token invalid or expired ❌");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
    return null;
  };

  useEffect(() => {
    // Ported verbatim from AuthContext.jsx's fetch-on-mount pattern. The
    // newer react-hooks lint rule flags setState-inside-effect on principle,
    // but this is the correct, standard "load session on mount" shape (not a
    // cascading-render bug) — same behavior as the original, not relaxed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, []);

  const login = (userData: AuthUser) => setUser(userData);

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
