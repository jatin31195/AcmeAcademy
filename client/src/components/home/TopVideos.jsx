import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube } from "lucide-react";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;



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

// Convert ISO 8601 → seconds
const parseDuration = (duration) => {
  const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  return h * 3600 + m * 60 + s;
};

// Convert seconds → mm:ss or hh:mm:ss
const formatDuration = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
};

const TopVideos = () => {
  const [latestVideos, setLatestVideos] = useState([]);
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

        const videoIds = searchData.items
          .map((v) => v.id.videoId)
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

        const filtered = detailsData.items
          .map((v) => ({
            id: v.id,
            title: v.snippet.title,
            thumbnail: v.snippet.thumbnails?.high?.url || "",
            duration: parseDuration(v.contentDetails.duration),
            date: new Date(v.snippet.publishedAt),
            link: `https://www.youtube.com/watch?v=${v.id}`,
          }))
          .filter((v) => v.duration > 120)
          .sort((a, b) => b.date - a.date)
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
        {/* 🎓 Top Lectures Section */}
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
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
              </div>
            </motion.a>
          ))}
        </div>

        {/* 🆕 Latest Videos Section */}
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
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {video.date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
