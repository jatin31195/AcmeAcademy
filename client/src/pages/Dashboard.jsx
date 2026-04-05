import { useState, useEffect, useRef, lazy, Suspense } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import UserProfileCard from "@/components/Dashboard/UserProfileCard";
import StatisticsCard from "@/components/Dashboard/StatisticsCard";

const PerformanceAnalyticsChart = lazy(() =>
  import("@/components/Dashboard/PerformanceAnalyticsChart")
);
const PerformanceProgressChart = lazy(() =>
  import("@/components/Dashboard/PerformanceProgressChart")
);
const TestRankingTable = lazy(() =>
  import("@/components/Dashboard/TestRankingTable")
);

const DASHBOARD_CACHE_KEY = "acme_dashboard_cache_v1";
const CACHE_TTL_MS = 2 * 60 * 1000;

const readDashboardCache = () => {
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

const writeDashboardCache = (data) => {
  try {
    sessionStorage.setItem(
      DASHBOARD_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignore cache write failures (private mode / quota issues)
  }
};

const Dashboard = () => {
  const hasFetchedRef = useRef(false);
  const cachedData = readDashboardCache();
  const [attempts, setAttempts] = useState(cachedData?.attempts || []);
  const [analytics, setAnalytics] = useState(cachedData?.analytics || []);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchDashboardData = async () => {
      try {
        setLoading((prev) => (cachedData ? prev : true));

        const [attemptsRes, analyticsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/users/user/all-test`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}/api/tests/user/performance/analytics`, {
            withCredentials: true,
          }),
        ]);

        const nextAttempts =
          attemptsRes.data?.success && Array.isArray(attemptsRes.data?.attempts)
            ? attemptsRes.data.attempts
            : [];

        const nextAnalytics =
          analyticsRes.data?.success && Array.isArray(analyticsRes.data?.analytics)
            ? analyticsRes.data.analytics
            : [];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

      <section className="relative py-8 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        </div>
      </section>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-10">
        <DashboardLayout />

        {/* Profile Card */}
        <div>
          <UserProfileCard />
        </div>

        {/* Statistics */}
        <div>
          <StatisticsCard />
        </div>

       
        <Suspense
          fallback={
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
              <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 text-center text-gray-500">
                Loading performance widgets...
              </div>
            </div>
          }
        >
          <PerformanceAnalyticsChart analytics={analytics} loading={loading} />
          <PerformanceProgressChart attempts={attempts} loading={loading} />
        </Suspense>
   

        {/* Test Ranking Table */}
        <div>
          <Suspense
            fallback={
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 text-center text-gray-500">
                  Loading test rankings...
                </div>
              </div>
            }
          >
            <TestRankingTable attempts={attempts} loading={loading} />
          </Suspense>
        </div>

        
        <div className="h-10" />
      </div>
    </div>
  );
};

export default Dashboard;
