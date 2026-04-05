import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

const SignaturePad = ({ onChange, value }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;

    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a2e";

    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      };
      img.src = value;
      setHasDrawn(true);
    }
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const touch = e.touches ? e.touches[0] : e;

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const start = (e) => {
    e.preventDefault();
    setDrawing(true);

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing) return;

    e.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    setHasDrawn(true);
  };

  const end = useCallback(() => {
    setDrawing(false);

    if (hasDrawn && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  }, [hasDrawn, onChange]);

  useEffect(() => {
    if (!drawing && hasDrawn && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  }, [drawing, hasDrawn, onChange]);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange(null);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Signature <span className="text-primary">*</span>
        </label>

        {hasDrawn && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="h-7 text-xs text-muted-foreground"
          >
            <Eraser className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="border-2 border-dashed rounded-lg border-border bg-card overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ height: 120 }}
          onMouseDown={start}
          onMouseMove={draw}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={draw}
          onTouchEnd={end}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Draw your signature above
      </p>
    </div>
  );
};

export default SignaturePad;