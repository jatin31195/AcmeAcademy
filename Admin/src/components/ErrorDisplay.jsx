import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ErrorDisplay = ({
  title = "Error",
  message,
  onRetry,
  variant = "inline",
}) => {
  if (variant === "page") {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-8">
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: "hsl(var(--destructive) / 0.1)" }}
        >
          <AlertCircle
            className="h-12 w-12"
            style={{ color: "hsl(var(--destructive))" }}
          />
        </div>

        <div className="text-center space-y-2">
          <h3
            className="text-lg font-semibold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {title}
          </h3>

          <p
            className="max-w-md"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {message}
          </p>
        </div>

        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <Alert
      variant="destructive"
      className="border"
      style={{
        backgroundColor: "hsl(var(--destructive) / 0.1)",
        borderColor: "hsl(var(--destructive) / 0.3)",
      }}
    >
      <AlertCircle className="h-4 w-4" />

      <AlertTitle>{title}</AlertTitle>

      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="ghost"
            size="sm"
            className="gap-1"
            style={{ color: "hsl(var(--destructive))" }}
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
