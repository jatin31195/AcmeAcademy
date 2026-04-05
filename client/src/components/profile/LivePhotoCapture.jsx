import { Camera, RefreshCw, Check } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const LivePhotoCapture = ({ onChange, value }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setStreaming(true);
      onChange(null);
    } catch (err) {
      alert("Unable to access camera. Please allow camera permissions.");
    }
  }, [onChange]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 640, 480);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onChange(dataUrl);

    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  };

  const retake = () => {
    onChange(null);
    startCamera();
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        Live Photo <span className="text-primary">*</span>
      </label>

      <p className="text-xs text-muted-foreground">
        Take a live instant photo for verification
      </p>

      <div className="border-2 border-dashed rounded-lg overflow-hidden border-border">

        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Live capture"
              className="w-full max-w-xs mx-auto"
            />
            <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          </div>
        ) : streaming ? (
          <video
            ref={videoRef}
            className="w-full max-w-xs mx-auto"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Camera className="w-10 h-10" />
            <span className="text-sm">No photo captured</span>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex justify-center gap-3 p-3 bg-muted/50">
          {value ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={retake}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retake
            </Button>
          ) : streaming ? (
            <Button
              type="button"
              size="sm"
              onClick={capture}
              className="bg-primary text-primary-foreground"
            >
              <Camera className="w-4 h-4 mr-1" />
              Capture
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={startCamera}
              className="bg-secondary text-secondary-foreground"
            >
              <Camera className="w-4 h-4 mr-1" />
              Open Camera
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePhotoCapture;