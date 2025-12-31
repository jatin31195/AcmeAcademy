import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/* ---------------------------------- */
/* Main Modal */
/* ---------------------------------- */

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const descriptionId = description ? "modal-description" : undefined;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={descriptionId}
        className={`
          ${sizeClasses[size]}
          max-h-[90vh]
          flex flex-col
        `}
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        {/* ---------------- HEADER (fixed) ---------------- */}
        <DialogHeader className="shrink-0">
          <DialogTitle
            style={{ color: "hsl(var(--foreground))" }}
          >
            {title}
          </DialogTitle>

          {description && (
            <DialogDescription
              id={descriptionId}
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* ---------------- BODY (scrollable) ---------------- */}
        <div className="flex-1 overflow-y-auto py-4 pr-2">
          {children}
        </div>

        {/* ---------------- FOOTER (fixed) ---------------- */}
        {footer && (
          <DialogFooter className="shrink-0 pt-4 border-t">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ---------------------------------- */
/* Confirm Dialog */
/* ---------------------------------- */

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}) => {
  const descriptionId = description ? "confirm-description" : undefined;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={descriptionId}
        className="max-w-md"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <DialogHeader>
          <DialogTitle
            style={{ color: "hsl(var(--foreground))" }}
          >
            {title}
          </DialogTitle>

          {description && (
            <DialogDescription
              id={descriptionId}
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            variant={variant === "destructive" ? "destructive" : "default"}
            className={variant === "default" ? "gradient-primary" : ""}
            style={
              variant === "default"
                ? { color: "hsl(var(--primary-foreground))" }
                : undefined
            }
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
