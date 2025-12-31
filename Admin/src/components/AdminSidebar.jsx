import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  Trophy,
  FileQuestion,
  Layers,
  FolderOpen,
  Mail,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BookOpen, label: "Home Courses", path: "/admin/home-courses" },
  { icon: GraduationCap, label: "Home Page Result Images", path: "/admin/home-images" },
  { icon: GraduationCap, label: "Home Page Notices", path: "/admin/home-notices" },
  { icon: BookOpen, label: "Free Self Study Courses", path: "/admin/courses" },
  
  { icon: Layers, label: "Practice Sets", path: "/admin/practice-sets" },
  { icon: HelpCircle, label: "Questions", path: "/admin/questions" },
  { icon: Trophy, label: "Yearly Results", path: "/admin/results" },
  { icon: FileQuestion, label: "PYQs", path: "/admin/pyqs" },
  { icon: Mail, label: "Mails", path: "/admin/mails" },
];

const AdminSidebar = () => {
  const { logout, adminEmail } = useAuth();
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-64 border-r"
      style={{
        backgroundColor: "hsl(var(--sidebar-background))",
        borderColor: "hsl(var(--sidebar-border))",
      }}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className="flex h-16 items-center gap-3 border-b px-6"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1
              className="text-lg font-semibold"
              style={{ color: "hsl(var(--sidebar-foreground))" }}
            >
              ACME Academy
            </h1>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "shadow-glow"
                    : "hover:bg-[hsl(var(--sidebar-accent))]"
                )}
                style={{
                  backgroundColor: isActive
                    ? "hsl(var(--sidebar-accent))"
                    : "transparent",
                  color: isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground))",
                }}
              >
                <item.icon
                  className="h-5 w-5"
                  style={{
                    color: isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                  }}
                />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div
          className="border-t p-4"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div
            className="mb-3 rounded-lg p-3"
            style={{ backgroundColor: "hsl(var(--sidebar-accent))" }}
          >
            <p className="text-xs text-gray-400">Logged in as</p>
            <p
              className="truncate text-sm font-medium"
              style={{ color: "hsl(var(--sidebar-foreground))" }}
            >
              {adminEmail || "Admin"}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            style={{ color: "hsl(var(--muted-foreground))" }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "hsl(var(--destructive))";
              e.currentTarget.style.backgroundColor =
                "hsl(var(--destructive) / 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color =
                "hsl(var(--muted-foreground))";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
