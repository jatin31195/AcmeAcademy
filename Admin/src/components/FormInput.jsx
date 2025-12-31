import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ---------------------------------- */
/* FormInput */
/* ---------------------------------- */

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  options = [],
  className,
  rows = 3,

  /* 🔥 NEW (for file input) */
  accept,
  preview, // "pdf" | "image"
}) => {
  const baseInputClass = cn(
    "border rounded-md w-full",
    error && "border-red-500"
  );

  const commonStyle = {
    backgroundColor: "hsl(var(--secondary))",
    borderColor: error
      ? "hsl(var(--destructive))"
      : "hsl(var(--border))",
  };

  /* ---------------------------------- */
  /* Render Input */
  /* ---------------------------------- */
  const renderInput = () => {
    /* ---------- TEXTAREA ---------- */
    if (type === "textarea") {
      return (
        <Textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={baseInputClass}
          style={commonStyle}
        />
      );
    }

    /* ---------- SELECT ---------- */
    if (type === "select") {
      return (
        <Select
          value={value ? String(value) : ""}
          onValueChange={(val) => onChange(val)}
          disabled={disabled}
        >
          <SelectTrigger
            className={baseInputClass}
            style={commonStyle}
          >
            <SelectValue
              placeholder={
                placeholder || `Select ${label.toLowerCase()}`
              }
            />
          </SelectTrigger>

          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    /* ---------- FILE (PDF / IMAGE) ---------- */
    if (type === "file") {
      return (
        <div className="space-y-2">
          <Input
            id={name}
            name={name}
            type="file"
            accept={accept}
            required={required}
            disabled={disabled}
            className={baseInputClass}
            style={commonStyle}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(file);
            }}
          />

          {/* ---------- FILE PREVIEW ---------- */}
          {value && preview === "pdf" && (
            <div className="text-sm">
              <p className="text-muted-foreground">
                Selected file:
              </p>
              <a
                href={
                  typeof value === "string"
                    ? value
                    : URL.createObjectURL(value)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {typeof value === "string"
                  ? value.split("/").pop()
                  : value.name}
              </a>
            </div>
          )}

          {value && preview === "image" && (
            <img
              src={
                typeof value === "string"
                  ? value
                  : URL.createObjectURL(value)
              }
              alt="preview"
              className="h-32 rounded border object-cover"
            />
          )}
        </div>
      );
    }

    /* ---------- DEFAULT INPUT ---------- */
    return (
      <Input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            type === "number"
              ? Number(e.target.value)
              : e.target.value
          )
        }
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={baseInputClass}
        style={commonStyle}
      />
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={name}
        style={{ color: "hsl(var(--foreground))" }}
      >
        {label}
        {required && (
          <span
            className="ml-1"
            style={{ color: "hsl(var(--destructive))" }}
          >
            *
          </span>
        )}
      </Label>

      {renderInput()}

      {error && (
        <p
          className="text-sm"
          style={{ color: "hsl(var(--destructive))" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
