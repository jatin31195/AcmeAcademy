import {
  Users,
  BookOpen,
  ClipboardList,
  HelpCircle,
  Trophy,
  TrendingUp,
  Activity,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";

const stats = [
  { title: "Total Users", value: "2,847", icon: Users, trend: { value: 12.5, isPositive: true } },
  { title: "Active Courses", value: "48", icon: BookOpen, trend: { value: 8.2, isPositive: true } },
  { title: "Total Tests", value: "156", icon: ClipboardList, trend: { value: 4.1, isPositive: true } },
  { title: "Questions Bank", value: "5,420", icon: HelpCircle, trend: { value: 15.3, isPositive: true } },
];

const recentActivity = [
  { id: 1, user: "John Doe", action: "Completed Python Basics Test", time: "5 minutes ago", score: "85%" },
  { id: 2, user: "Jane Smith", action: "Enrolled in Data Science", time: "12 minutes ago", score: "-" },
  { id: 3, user: "Mike Johnson", action: "Submitted Practice Set", time: "28 minutes ago", score: "92%" },
  { id: 4, user: "Sarah Wilson", action: "Started JavaScript Course", time: "45 minutes ago", score: "-" },
  { id: 5, user: "Alex Brown", action: "Completed Mock Exam", time: "1 hour ago", score: "78%" },
];

const topPerformers = [
  { id: 1, name: "Emily Chen", course: "Machine Learning", score: 98, tests: 12 },
  { id: 2, name: "David Park", course: "Web Development", score: 96, tests: 15 },
  { id: 3, name: "Lisa Wang", course: "Data Structures", score: 94, tests: 10 },
  { id: 4, name: "James Miller", course: "Python Advanced", score: 92, tests: 8 },
];

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of ACME Academy."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Activity Chart */}
        <div
          className="rounded-xl p-6 shadow-card border"
          style={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                User Activity
              </h3>
              <p style={{ color: "hsl(var(--muted-foreground))" }} className="text-sm">
                Last 7 days
              </p>
            </div>
            <Activity style={{ color: "hsl(var(--primary))" }} className="h-5 w-5" />
          </div>

          <div
            className="h-48 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: "hsl(var(--muted))" }}
          >
            <div className="text-center">
              <TrendingUp
                className="h-12 w-12 mx-auto mb-2"
                style={{ color: "hsl(var(--primary))" }}
              />
              <p style={{ color: "hsl(var(--muted-foreground))" }} className="text-sm">
                Activity chart visualization
              </p>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div
          className="rounded-xl p-6 shadow-card border"
          style={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Top Performers
              </h3>
              <p style={{ color: "hsl(var(--muted-foreground))" }} className="text-sm">
                This month
              </p>
            </div>
            <Trophy style={{ color: "hsl(var(--warning))" }} className="h-5 w-5" />
          </div>

          <div className="space-y-4">
            {topPerformers.map((p, index) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: "hsl(var(--muted))" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: "hsl(var(--primary) / 0.2)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {p.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {p.course}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className="font-semibold"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {p.score}%
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {p.tests} tests
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-xl shadow-card border"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Recent Activity
          </h3>
          <p
            className="text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Latest user actions across the platform
          </p>
        </div>

        <DataTable
          columns={[
            { key: "user", header: "User" },
            { key: "action", header: "Action" },
            { key: "score", header: "Score" },
            { key: "time", header: "Time" },
          ]}
          data={recentActivity}
          className="border-0 rounded-t-none shadow-none"
        />
      </div>
    </div>
  );
};

export default Dashboard;
