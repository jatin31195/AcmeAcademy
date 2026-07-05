"use client";

import { createContext, useState, useEffect, useContext, useRef, type ReactNode } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

// Ported from client/src/UserContext.jsx. Kept as its own independent
// refresh-on-401 implementation (not merged with auth-provider.tsx's), per
// Phase 3's explicit "do not refactor" instruction taking precedence over
// the migration blueprint's "nice to have" consolidation suggestion —
// merging them risked subtly changing either one's error handling.
//
// One real bug fix, not a redesign: the original read `sessionStorage`
// directly in the component body (`const cachedUser = readUserCache();`)
// to synchronously seed initial state and avoid a loading flash. That's
// safe in a pure CSR app but crashes during Next.js's server-side render
// pass (no `sessionStorage` on the server). Fixed by seeding state with a
// safe `null` default and reading the cache inside a `useEffect` instead —
// the only visible difference is that a cache hit now appears one tick
// after mount rather than in the very first paint, which is the minimum
// change required for this to run under SSR at all.

const API_BASE = `${BASE_URL}/api/users`;
const USER_CACHE_KEY = "acme_user_cache_v1";
const USER_CACHE_TTL_MS = 5 * 60 * 1000;

type UserData = {
  _id?: string;
  id?: string;
  email?: string;
  fullname?: string;
  profilePic?: string;
  initials?: string;
  verificationProfileLocked?: boolean;
  verificationProfileSubmitted?: boolean;
  [key: string]: unknown;
};

type UserContextValue = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  fetchUser: (opts?: { silent?: boolean }) => Promise<void>;
  loading: boolean;
  error: string;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const enrichUserData = (userData: UserData | null): UserData => {
  const nextUser: UserData = userData || {};

  if (!nextUser.profilePic && nextUser.fullname) {
    nextUser.initials = nextUser.fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return nextUser;
};

const readUserCache = (): UserData | null => {
  if (typeof window === "undefined") return null;
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

const writeUserCache = (data: UserData) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Ignore cache write failure (private mode / quota)
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const authUser = auth?.user ?? null;
  const authLoading = auth?.loading ?? true;
  const hasBootstrappedRef = useRef(false);
  const lastAuthIdentityRef = useRef<string | null>(null);

  // Safe default for SSR; the real cache (if any) is applied in the effect
  // below, immediately on mount, client-side only.
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) setLoading(true);
      const res = await axios.get(`${API_BASE}/profile`, { withCredentials: true });
      const userData = enrichUserData(res.data?.data?.user || {});

      setUser(userData);
      writeUserCache(userData);
      setError("");
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;

      if (status === 401) {
        try {
          await axios.post(`${API_BASE}/refresh`, {}, { withCredentials: true });

          const retryRes = await axios.get(`${API_BASE}/profile`, { withCredentials: true });

          const retryUserData = enrichUserData(retryRes.data?.data?.user || {});
          setUser(retryUserData);
          writeUserCache(retryUserData);
          setError("");
          return;
        } catch (refreshErr) {
          // console.warn (not .error): an expired/invalid refresh token is an
          // expected, fully-handled state for a logged-out visitor on any
          // page (this provider mounts app-wide, same as the original's
          // AuthContext/UserContext at the SPA root) — not a crash. Using
          // .error here made Next's dev overlay treat it as a fatal error on
          // every anonymous page load, which the original's plain
          // console.error never surfaced this prominently for (Vite's dev
          // console has no error-overlay interception). Same message text,
          // same control flow — only the console method changed.
          console.warn("❌ Failed to refresh user session:", refreshErr);
        }
      }

      console.warn("❌ Failed to fetch user:", err);
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

  // Client-only cache seed — runs once on mount, before the bootstrap effect
  // below, so a cache hit still shows up almost immediately (just not in the
  // literal first paint, unlike the original's SSR-unsafe render-time read).
  useEffect(() => {
    const cached = readUserCache();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only cache seed, ported behavior (see comment above)
      setUser(cached);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const authIdentity = authUser?._id || authUser?.id || authUser?.email || null;
    const authChanged = lastAuthIdentityRef.current !== authIdentity;

    if (hasBootstrappedRef.current && !authChanged) return;

    hasBootstrappedRef.current = true;
    lastAuthIdentityRef.current = authIdentity as string | null;

    const hasCached = !!readUserCache();

    if (authUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auth-identity bootstrap, ported behavior
      setUser((prev) => prev || enrichUserData(authUser));
      fetchUser({ silent: hasCached || !!readUserCache() });
      return;
    }

    fetchUser({ silent: hasCached });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, authUser]);

  return <UserContext.Provider value={{ user, setUser, fetchUser, loading, error }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
