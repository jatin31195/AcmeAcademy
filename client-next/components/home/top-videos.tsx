"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube } from "lucide-react";

// Ported from client/src/components/home/TopVideos.jsx, including the
// direct client-side call to the YouTube Data API with an API key exposed
// in the browser bundle. The migration blueprint flags moving this
// server-side as a worthwhile future security improvement, but that's an
// architectural change beyond this phase's strict parity scope — carried
// over unchanged here, same as the original.
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_CHANNEL_ID;

const staticVideos = [
  {
    id: "RjOI5bcxwtM",
    title: "NIMCET 2025 TOPPER Reveals BEST Strategies for Success",
    thumbnail: "https://img.youtube.com/vi/RjOI5bcxwtM/maxresdefault.jpg",
    link: "https://youtu.be/RjOI5bcxwtM",
  },
  {
    id: "M4kMKyYIqEo",
    title: "AIR 8 in NIMCET 2025 | Arnab Banik Live Interview",
    thumbnail: "https://img.youtube.com/vi/M4kMKyYIqEo/hqdefault.jpg",
    link: "https://youtu.be/M4kMKyYIqEo",
  },
  {
    id: "3uWJHbNdlkw",
    title: "AIR-10 in NIMCET-2025 | Mustafa Live Interview",
    thumbnail: "https://img.youtube.com/vi/3uWJHbNdlkw/hqdefault.jpg",
    link: "https://youtu.be/3uWJHbNdlkw",
  },
  {
    id: "nVinl-LwHpg",
    title: "Complete Class 11th Mathematics in One Shot in 12 Hours | IIT-JEE | NIMCET | CUET",
    thumbnail: "https://img.youtube.com/vi/nVinl-LwHpg/hqdefault.jpg",
    link: "https://www.youtube.com/live/nVinl-LwHpg",
  },
  {
    id: "VC3SzEwXq5I",
    title: "Set Theory NIMCET PYQs 2008–2022 - Short Tricks",
    thumbnail: "https://img.youtube.com/vi/VC3SzEwXq5I/hqdefault.jpg",
    link: "https://www.youtube.com/watch?v=VC3SzEwXq5I",
  },
  {
    id: "Fn6ngxNn3ds",
    title: "Free Computer Course | NIMCET & CUET 2025–2026 Series",
    thumbnail: "https://img.youtube.com/vi/Fn6ngxNn3ds/hqdefault.jpg",
    link: "https://youtube.com/playlist?list=PLjgKXowPULMnNjMybwG1PQxhBhDJeyPIq",
  },
];

type LatestVideo = {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  date: Date;
  link: string;
};

const parseDuration = (duration: string): number => {
  const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  return h * 3600 + m * 60 + s;
};

const formatDuration = (sec: number): string => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` : `${m}:${s.toString().padStart(2, "0")}`;
};

const TopVideos = () => {
  const [latestVideos, setLatestVideos] = useState<LatestVideo[]>([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&type=video&maxResults=10`
        );
        const searchData = await searchRes.json();

        if (searchData.error?.errors?.[0]?.reason === "quotaExceeded") {
          console.warn("YouTube API quota exceeded. Hiding latest videos.");
          setQuotaExceeded(true);
          return;
        }

        // Defensive addition (not present in the original, which crashed here
        // on any non-quotaExceeded API error, e.g. an invalid/missing key):
        // any other error shape also has no `items` array, so bail out
        // silently instead of throwing, same as the quotaExceeded branch above.
        if (!Array.isArray(searchData.items)) {
          console.warn("YouTube API returned no items (invalid key or other API error). Hiding latest videos.", searchData.error);
          setQuotaExceeded(true);
          return;
        }

        const videoIds = searchData.items
          .map((v: { id: { videoId?: string } }) => v.id.videoId)
          .filter(Boolean)
          .join(",");

        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,contentDetails`
        );
        const detailsData = await detailsRes.json();

        if (detailsData.error?.errors?.[0]?.reason === "quotaExceeded") {
          console.warn("Quota exceeded on video details. Hiding latest videos.");
          setQuotaExceeded(true);
          return;
        }

        // Same defensive addition as above, for the second API call.
        if (!Array.isArray(detailsData.items)) {
          console.warn("YouTube API returned no video details (invalid key or other API error). Hiding latest videos.", detailsData.error);
          setQuotaExceeded(true);
          return;
        }

        type ApiVideoItem = {
          id: string;
          snippet: { title: string; thumbnails?: { high?: { url: string } }; publishedAt: string };
          contentDetails: { duration: string };
        };

        const filtered = detailsData.items
          .map((v: ApiVideoItem) => ({
            id: v.id,
            title: v.snippet.title,
            thumbnail: v.snippet.thumbnails?.high?.url || "",
            duration: parseDuration(v.contentDetails.duration),
            date: new Date(v.snippet.publishedAt),
            link: `https://www.youtube.com/watch?v=${v.id}`,
          }))
          .filter((v: LatestVideo) => v.duration > 120)
          .sort((a: LatestVideo, b: LatestVideo) => b.date.getTime() - a.date.getTime())
          .slice(0, 10);

        setLatestVideos(filtered);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setQuotaExceeded(true);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/40 to-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-bold font-heading mb-10 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Youtube className="inline h-8 w-8 text-red-600 mr-2" />
          Top YouTube Lectures
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {staticVideos.map((video, index) => (
            <motion.a
              key={video.id}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl bg-white border border-gray-200/60 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{video.title}</h3>
              </div>
            </motion.a>
          ))}
        </div>

        {!quotaExceeded && latestVideos.length > 0 && (
          <>
            <motion.h2
              className="text-4xl font-bold font-heading mb-10 gradient-text"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Youtube className="inline h-8 w-8 text-red-600 mr-2" />
              Latest YouTube Uploads
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestVideos.map((video, index) => (
                <motion.a
                  key={video.id}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl bg-white border border-gray-200/60 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <span className="absolute top-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded-md">
                      {formatDuration(video.duration)}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{video.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {video.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TopVideos;
