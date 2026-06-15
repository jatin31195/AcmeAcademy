import { cn } from "@/lib/utils";

const StatsCard = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div
      className={cn(
        "group card-elevated hover-lift relative overflow-hidden p-5 sm:p-6",
        className
      )}
    >
      {/* subtle brand glow on hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[hsl(var(--primary)/0.12)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value ?? "—"}
          </p>

          {trend && (
            <p
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium"
              style={{
                color: trend.isPositive
                  ? "hsl(var(--success))"
                  : "hsl(var(--destructive))",
              }}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>

        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-primary shadow-glow transition-transform duration-300 group-hover:scale-110">
          {Icon && <Icon className="h-6 w-6 text-white" />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
