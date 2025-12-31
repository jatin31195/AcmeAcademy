import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingSpinner = ({
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Loader2
        className={cn("animate-spin", sizeClasses[size])}
        style={{ color: "hsl(var(--primary))" }}
      />

      {text && (
        <p
          className="text-sm"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export const PageLoader = ({ text = "Loading..." }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export const ButtonLoader = () => (
  <Loader2
    className="h-4 w-4 animate-spin"
    style={{ color: "currentColor" }}
  />
);

export default LoadingSpinner;
