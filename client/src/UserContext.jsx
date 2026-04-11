import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import { useAuth } from "./AuthContext";

const API_BASE = `${BASE_URL}/api/users`;
const USER_CACHE_KEY = "acme_user_cache_v1";
const USER_CACHE_TTL_MS = 5 * 60 * 1000;
const UserContext = createContext();

const enrichUserData = (userData) => {
  const nextUser = userData || {};

  if (!nextUser.profilePic && nextUser.fullname) {
    nextUser.initials = nextUser.fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return nextUser;
};

const readUserCache = () => {
  try {
    const raw = sessionStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !parsed?.data) return null;
    if (Date.now() - parsed.timestamp > USER_CACHE_TTL_MS) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

const writeUserCache = (data) => {
  try {
    sessionStorage.setItem(
      USER_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignore cache write failure (private mode / quota)
  }
};

export const UserProvider = ({ children }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const hasBootstrappedRef = useRef(false);
  const lastAuthIdentityRef = useRef(null);
  const cachedUser = readUserCache();
  const seededUser = cachedUser || (authUser ? enrichUserData(authUser) : null);
  const [user, setUser] = useState(seededUser);
  const [loading, setLoading] = useState(!seededUser);
  const [error, setError] = useState("");


  const fetchUser = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await axios.get(`${API_BASE}/profile`, {
        withCredentials: true,
      });
      const userData = enrichUserData(res.data?.data?.user || {});

      setUser(userData);
      writeUserCache(userData);
      setError("");
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        try {
          await axios.post(
            `${API_BASE}/refresh`,
            {},
            { withCredentials: true }
          );

          const retryRes = await axios.get(`${API_BASE}/profile`, {
            withCredentials: true,
          });

          const retryUserData = enrichUserData(retryRes.data?.data?.user || {});
          setUser(retryUserData);
          writeUserCache(retryUserData);
          setError("");
          return;
        } catch (refreshErr) {
          console.error("❌ Failed to refresh user session:", refreshErr);
        }
      }

      console.error("❌ Failed to fetch user:", err);
      if (!readUserCache() && !authUser) {
        setUser(null);
      } else if (authUser) {
        setUser(enrichUserData(authUser));
      }
      setError("Failed to load user data");
    } finally {
      if (!silent) setLoading(false);
    }
  };

 
  useEffect(() => {
    if (authLoading) return;

    const authIdentity = authUser?._id || authUser?.id || authUser?.email || null;
    const authChanged = lastAuthIdentityRef.current !== authIdentity;

    if (hasBootstrappedRef.current && !authChanged) return;

    hasBootstrappedRef.current = true;
    lastAuthIdentityRef.current = authIdentity;

    const hasCached = !!readUserCache();

    if (authUser) {
      setUser((prev) => prev || enrichUserData(authUser));
      fetchUser({ silent: hasCached || !!seededUser });
      return;
    }

    fetchUser({ silent: hasCached });
  }, [authLoading, authUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
