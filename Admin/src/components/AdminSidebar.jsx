import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Trophy,
  FileQuestion,
  Layers,
  Mail,
  Inbox,
  TrendingUp,
  GraduationCap,
  Image,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Grouped navigation — purely presentational. Every path/label/icon
   is preserved exactly; items are organized for clearer hierarchy. */
const menuSections = [
  {
    label: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", path: "/admin" }],
  },
  {
    label: "People",
    items: [
      { icon: Users, label: "Users", path: "/admin/users" },
      { icon: Inbox, label: "Enquiries", path: "/admin/enquiries" },
      { icon: TrendingUp, label: "Rank Predictor Users", path: "/admin/rank-predictor-users" },
    ],
  },
  {
    label: "Website",
    items: [
      { icon: BookOpen, label: "Home Courses", path: "/admin/home-courses" },
      { icon: Image, label: "Home Page Result Images", path: "/admin/home-images" },
      { icon: Bell, label: "Home Page Notices", path: "/admin/home-notices" },
    ],
  },
  {
    label: "Learning",
    items: [
      { icon: GraduationCap, label: "Free Self Study Courses", path: "/admin/courses" },
      { icon: Layers, label: "Practice Sets", path: "/admin/practice-sets" },
      { icon: FileQuestion, label: "PYQs", path: "/admin/pyqs" },
      { icon: Trophy, label: "Yearly Results", path: "/admin/results" },
    ],
  },
  {
    label: "Communication",
    items: [{ icon: Mail, label: "Mails", path: "/admin/mails" }],
  },
];

const AdminSidebar = ({ mobileOpen = false, onClose }) => {
  const { logout, adminEmail } = useAuth();
  const location = useLocation();

  const isItemActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r transition-transform duration-300 ease-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      style={{
        backgroundColor: "hsl(var(--sidebar-background))",
        borderColor: "hsl(var(--sidebar-border))",
      }}
    >
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div
          className="flex h-16 items-center gap-3 border-b px-5"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-glow">
            <img
              src="/logo.png"
              alt="ACME Academy"
              className="h-7 w-7 object-contain"
            />
          </div>
          <div className="leading-tight">
            <h1
              className="text-[15px] font-bold tracking-tight"
              style={{ color: "hsl(var(--sidebar-foreground))" }}
            >
              ACME Academy
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {menuSections.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = isItemActive(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose?.()}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))]"
                    )}
                    style={
                      active
                        ? { backgroundColor: "hsl(var(--primary) / 0.12)" }
                        : undefined
                    }
                  >
                    {/* Active indicator bar */}
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-all duration-200",
                        active ? "opacity-100" : "opacity-0"
                      )}
                      style={{ backgroundColor: "hsl(var(--primary))" }}
                    />
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        active
                          ? "text-[hsl(var(--primary))]"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div
          className="border-t p-3"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-border/60 bg-[hsl(var(--sidebar-accent))] p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-primary text-xs font-bold text-white">
              {(adminEmail || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Signed in as
              </p>
              <p
                className="truncate text-sm font-medium"
                style={{ color: "hsl(var(--sidebar-foreground))" }}
              >
                {adminEmail || "Admin"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
