"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Maximize2 } from "lucide-react";

// Ported from client/src/pages/PdfReader.jsx's back-button and fullscreen
// handler (browser History API + Fullscreen API — both Client-only).
export function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition" title="Go Back">
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}

export function FullscreenButton() {
  const handleFullScreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <button onClick={handleFullScreen} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition" title="Fullscreen">
      <Maximize2 className="h-5 w-5" />
    </button>
  );
}
