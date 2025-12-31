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

/* ---------- SIMPLE MODAL ---------- */
/* ---------- USER DETAILS MODAL ---------- */
const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-[420px] rounded-xl border shadow-2xl"
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
        <div className="px-6 py-5 space-y-3 text-sm">
          <div className="flex justify-between">
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

          <div className="flex justify-between">
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
          className="px-6 py-4 border-t flex justify-end"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium transition"
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
          className="text-blue-600 hover:underline"
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
          className="text-blue-600 hover:underline"
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
        <div className="rounded-xl p-6 border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top Performers</h3>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>

          {topPerformers.map((p, i) => (
            <div
              key={i}
              onClick={() =>
                setSelectedUser({ name: p.name, userId: p.userId })
              }
              className="flex justify-between p-3 rounded-lg cursor-pointer hover:bg-muted"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.tests} tests
                </p>
              </div>
              <p className="font-semibold text-primary">
                Avg {p.avgScore}
              </p>
            </div>
          ))}
        </div>

        {/* Placeholder chart */}
        <div className="rounded-xl p-6 border bg-card flex items-center justify-center">
          <TrendingUp className="h-12 w-12 text-primary" />
        </div>
      </div>

      {/* ---------- RECENT ACTIVITY ---------- */}
      <div className="rounded-xl border bg-card">
        <div className="p-6 border-b">
          <h3 className="font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Click any row to explore details
          </p>
        </div>

        <DataTable
          columns={activityColumns}
          data={recentActivity}
          className="border-0"
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
