import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  ClipboardList,
  HelpCircle,
  Trophy,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import { BASE_URL } from "@/config";
import { cn } from "@/lib/utils";

/* ---------- SIMPLE MODAL ---------- */
/* ---------- USER DETAILS MODAL ---------- */
const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl border shadow-2xl"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            User Details
          </h3>
        </div>

        {/* Body */}
        <div className="space-y-3 px-4 py-5 text-sm sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span style={{ color: "hsl(var(--muted-foreground))" }}>
              Name
            </span>
            <span
              className="font-medium"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {user.name}
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span style={{ color: "hsl(var(--muted-foreground))" }}>
              User ID
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {user.userId}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex border-t px-4 py-4 sm:px-6 sm:justify-end"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <button
            onClick={onClose}
            className="w-full rounded-md px-4 py-2 text-sm font-medium transition sm:w-auto"
            style={{
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const API = `${BASE_URL}/api/admin/dashboard/overview`;

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ---------------- FETCH DASHBOARD ---------------- */
  const fetchDashboard = async () => {
    try {
      const res = await fetch(API, { credentials: "include" });
      const data = await res.json();

      setStats([
        { title: "Total Users", value: data.stats.totalUsers, icon: Users },
        { title: "Active Courses", value: data.stats.activeCourses, icon: BookOpen },
        { title: "Total Tests", value: data.stats.totalTests, icon: ClipboardList },
        { title: "Questions Bank", value: data.stats.questionBank, icon: HelpCircle },
      ]);

      setRecentActivity(data.recentActivity || []);
      setTopPerformers(data.topPerformers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ---------------- TABLE COLUMNS ---------------- */
  const activityColumns = [
    {
      key: "user",
      header: "User",
      render: (row) => (
        <button
          onClick={() =>
            setSelectedUser({ name: row.user, userId: row.userId })
          }
          className="font-medium text-primary transition-colors hover:underline"
        >
          {row.user}
        </button>
      ),
    },
    {
      key: "testTitle",
      header: "Test",
      render: (row) => (
        <button
          onClick={() =>
            navigate(
              `/admin/tests/${row.testId}/attempt/${row.attemptNumber}`
            )
          }
          className="font-medium text-primary transition-colors hover:underline"
        >
          {row.testTitle}
        </button>
      ),
    },
    {
      key: "attemptNumber",
      header: "Attempt",
      render: (row) => `#${row.attemptNumber}`,
    },
    {
      key: "score",
      header: "Score",
      render: (row) => (
        <span className="font-medium">
          {row.score}/{row.totalMarks} ({row.accuracy}%)
        </span>
      ),
    },
    { key: "time", header: "Time" },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of ACME Academy."
      />

      {/* ---------- STATS ---------- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* ---------- TOP PERFORMERS ---------- */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="card-elevated p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold tracking-tight">Top Performers</h3>
              <p className="text-xs text-muted-foreground">Highest average scores</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
          </div>

          <div className="space-y-1">
            {topPerformers.map((p, i) => (
              <div
                key={i}
                onClick={() =>
                  setSelectedUser({ name: p.name, userId: p.userId })
                }
                className="flex items-center justify-between gap-3 rounded-lg p-3 cursor-pointer transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                      i === 0
                        ? "bg-amber-500/20 text-amber-500"
                        : i === 1
                        ? "bg-slate-400/20 text-slate-300"
                        : i === 2
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.tests} tests</p>
                  </div>
                </div>
                <p className="shrink-0 font-semibold text-primary">Avg {p.avgScore}</p>
              </div>
            ))}

            {!topPerformers.length && (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <Trophy className="h-8 w-8 opacity-40" />
                <p className="text-sm">No performer data yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics placeholder */}
        <div className="card-elevated flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--primary)/0.12)]">
            <Activity className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">Performance Analytics</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Trend charts will appear here.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- RECENT ACTIVITY ---------- */}
      <div className="card-elevated overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 p-5 sm:p-6">
          <div>
            <h3 className="font-semibold tracking-tight">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">
              Click any row to explore details
            </p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--primary)/0.12)]">
            <Activity className="h-5 w-5 text-primary" />
          </div>
        </div>

        <DataTable
          columns={activityColumns}
          data={recentActivity}
          className="border-0 shadow-none rounded-none"
        />
      </div>

      {/* ---------- USER MODAL ---------- */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
