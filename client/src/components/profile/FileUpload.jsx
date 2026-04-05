import { Upload, X, Check } from "lucide-react";
import { useRef, useState } from "react";

const FileUpload = ({
  label,
  accept = "image/*",
  onChange,
  value,
  required,
  hint,
}) => {
  const ref = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;

    onChange(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clear = () => {
    onChange(null);
    setPreview(null);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>

      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      <div
        onClick={() => !value && ref.current && ref.current.click()}
        className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer flex items-center gap-3 ${
          value
            ? "border-secondary bg-secondary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/50"
        }`}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-14 h-14 rounded object-cover border border-border"
          />
        ) : (
          <div className="w-14 h-14 rounded bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {value ? (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground truncate">
                {value.name}
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              Click to upload
            </span>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            className="text-muted-foreground hover:text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;