"use client";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import UserProfileCard from "@/components/dashboard/user-profile-card";
import StatisticsCard from "@/components/dashboard/statistics-card";

// Ported from client/src/pages/Dashboard.jsx. Same React.lazy + Suspense
// code-splitting as the original (this works identically in a Next.js
// Client Component — no framework-specific change needed here, unlike
// libraries that touch `window` at module scope).
const PerformanceAnalyticsChart = lazy(() => import("@/components/dashboard/performance-analytics-chart"));
const PerformanceProgressChart = lazy(() => import("@/components/dashboard/performance-progress-chart"));
const TestRankingTable = lazy(() => import("@/components/dashboard/test-ranking-table"));

const DASHBOARD_CACHE_KEY = "acme_dashboard_cache_v1";
const CACHE_TTL_MS = 2 * 60 * 1000;

type DashboardCache = { attempts: unknown[]; analytics: unknown[] };

// Client-only cache read — the original read this directly in the component
// body (render-time), which is safe in a pure CSR app but crashes during
// Next.js's server render pass (no sessionStorage on the server). Guarded
// here the same way as UserProvider's cache read in Phase 3's auth work.
const readDashboardCache = (): DashboardCache | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DASHBOARD_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !parsed?.data) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

const writeDashboardCache = (data: DashboardCache) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Ignore cache write failures (private mode / quota issues)
  }
};

export function DashboardContent() {
  const hasFetchedRef = useRef(false);
  const [attempts, setAttempts] = useState<unknown[]>([]);
  const [analytics, setAnalytics] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const user = auth?.user;
  const authLoading = auth?.loading;
  const router = useRouter();

  // Client-only cache seed (see readDashboardCache's SSR-safety note above).
  useEffect(() => {
    const cached = readDashboardCache();
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only cache seed, ported behavior
      setAttempts(cached.attempts || []);
      setAnalytics(cached.analytics || []);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchDashboardData = async () => {
      try {
        const cachedData = readDashboardCache();
        setLoading((prev) => (cachedData ? prev : true));

        const [attemptsRes, analyticsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/users/user/all-test`, { withCredentials: true }),
          axios.get(`${BASE_URL}/api/tests/user/performance/analytics`, { withCredentials: true }),
        ]);

        const nextAttempts = attemptsRes.data?.success && Array.isArray(attemptsRes.data?.attempts) ? attemptsRes.data.attempts : [];

        const nextAnalytics = analyticsRes.data?.success && Array.isArray(analyticsRes.data?.analytics) ? analyticsRes.data.analytics : [];

        setAttempts(nextAttempts);
        setAnalytics(nextAnalytics);
        writeDashboardCache({ attempts: nextAttempts, analytics: nextAnalytics });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 relative">
      {!authLoading && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>

          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => router.push("/login")}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Login to Track Your Progress</h2>
            <p className="text-lg text-gray-600 mb-6">Let Acme Academy Prepare You for the Best Result</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <div className={!authLoading && !user ? "blur-[0.5px] pointer-events-none" : ""}>
        <section className="relative py-8 hero-gradient overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"></div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-10">
          <DashboardLayout />

          <div>
            <UserProfileCard />
          </div>

          <div>
            <StatisticsCard />
          </div>

          <Suspense
            fallback={
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 text-center text-gray-500">Loading performance widgets...</div>
              </div>
            }
          >
            <PerformanceAnalyticsChart analytics={analytics as never} loading={loading} />
            <PerformanceProgressChart attempts={attempts as never} loading={loading} />
          </Suspense>

          <div>
            <Suspense
              fallback={
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                  <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 text-center text-gray-500">Loading test rankings...</div>
                </div>
              }
            >
              <TestRankingTable attempts={attempts as never} loading={loading} />
            </Suspense>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}
