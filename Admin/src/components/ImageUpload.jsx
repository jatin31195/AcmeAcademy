import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ImageUpload = ({
  label,
  value,
  onChange,
  onRemove,
  accept = "image/*",
  maxSize = 5,
  className,
  error,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleFile = (file) => {
    setLocalError(null);

    if (file.size > maxSize * 1024 * 1024) {
      setLocalError(`File size must be less than ${maxSize}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  const borderColor = error || localError
    ? "hsl(var(--destructive))"
    : dragActive
    ? "hsl(var(--primary))"
    : "hsl(var(--border))";

  return (
    <div className={cn("space-y-2", className)}>
      <label
        className="text-sm font-medium"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {label}
      </label>

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          borderColor,
          backgroundColor: dragActive
            ? "hsl(var(--primary) / 0.05)"
            : "transparent",
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative p-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />

            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={() => !disabled && inputRef.current?.click()}
          >
            <div
              className="p-3 rounded-full mb-3"
              style={{ backgroundColor: "hsl(var(--secondary))" }}
            >
              <ImageIcon
                className="h-6 w-6"
                style={{ color: "hsl(var(--muted-foreground))" }}
              />
            </div>

            <p
              className="text-sm mb-1"
              style={{ color: "hsl(var(--foreground))" }}
            >
              <span
                className="font-medium"
                style={{ color: "hsl(var(--primary))" }}
              >
                Click to upload
              </span>{" "}
              or drag and drop
            </p>

            <p
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {(error || localError) && (
        <p
          className="text-sm"
          style={{ color: "hsl(var(--destructive))" }}
        >
          {error || localError}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
