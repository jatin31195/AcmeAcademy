"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import Image from "next/image";

// Ported from client/src/pages/AcmePlayer.jsx. Per the migration blueprint's
// file mapping, this was a "page" only nominally — it was always also reused
// as a plain prop-driven child component (e.g. inside LibraryContent's video
// modal) and never had its own real route content. Demoted to a shared
// component, not a standalone page.
const AcmePlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [muted, setMuted] = useState(false);

  if (!videoUrl) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-md shadow-md">
        <Image src="/logo.png" alt="Acme Logo" width={842} height={711} className="h-10 w-10" />
        <h1 className="text-xl font-bold text-gray-800">Acme Academy Player</h1>
      </div>

      <div className="p-4">
        <iframe
          className="w-full h-[60vh] md:h-[70vh] rounded-lg shadow-lg"
          src={videoUrl}
          title="Acme Academy Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <div className="mt-2 flex items-center gap-3">
          <button
            className="flex items-center gap-1 text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
            onClick={() => setMuted(!muted)}
          >
            <Play className="h-4 w-4" /> {muted ? "Unmute" : "Mute"}
          </button>
          <a
            href={videoUrl.replace("/embed/", "/watch?v=")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            <ExternalLink className="h-4 w-4" /> Open on YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

export default AcmePlayer;
