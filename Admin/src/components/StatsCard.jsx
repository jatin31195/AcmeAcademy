import { cn } from "@/lib/utils";

const StatsCard = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-card transition-all duration-300 hover:shadow-glow border",
        className
      )}
      style={{
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {title}
          </p>

          <p
            className="mt-2 text-3xl font-bold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {value}
          </p>

          {trend && (
            <p
              className="mt-2 text-sm font-medium"
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

        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: "hsl(var(--primary) / 0.12)" }}
        >
          <Icon
            className="h-6 w-6"
            style={{ color: "hsl(var(--primary))" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
