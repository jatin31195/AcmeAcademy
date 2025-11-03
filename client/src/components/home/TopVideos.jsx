import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube } from "lucide-react";

const API_KEY = "AIzaSyCQUwCbvx8FBpVZT01zkkLELyWbVmSn4eA";
const CHANNEL_ID = "UCCTGL0PszN3EOTcXgViH4DA";

const staticVideos = [
  {
    id: 1,
    title: "NIMCET 2025 TOPPER Reveals BEST Strategies for Success",
    thumbnail: "https://img.youtube.com/vi/RjOI5bcxwtM/maxresdefault.jpg",
    link: "https://youtu.be/RjOI5bcxwtM?si=m72B3ezr8hkLsDfx",
  },
  {
    id: 2,
    title: "AIR 8 in NIMCET 2025 | Arnab Banik Live Interview",
    thumbnail: "https://img.youtube.com/vi/M4kMKyYIqEo/hqdefault.jpg",
    link: "https://youtu.be/M4kMKyYIqEo?si=7PtbeYhJqUibkoh1",
  },
  {
    id: 3,
    title:
      "AIR-10 in NIMCET-2025 | Mustafa Live Interview",
    thumbnail: "https://img.youtube.com/vi/3uWJHbNdlkw/hqdefault.jpg",
    link: "https://youtu.be/3uWJHbNdlkw?si=ukU5S-SG1BsATW5f",
  },
    {
    id: 1,
    title: "Complete Class 11th Mathematics in One Shot in 12 Hours | IIT-JEE | NIMCET | CUET",
    thumbnail: "https://img.youtube.com/vi/nVinl-LwHpg/hqdefault.jpg",
    link: "https://www.youtube.com/live/nVinl-LwHpg?si=rE19YFLXSsxRCH12",
  },
  {
    id: 2,
    title: "Set Theory NIMCET PYQs 2008–2022 - Short Tricks",
    thumbnail: "https://img.youtube.com/vi/VC3SzEwXq5I/hqdefault.jpg",
    link: "https://www.youtube.com/watch?v=VC3SzEwXq5I",
  },
  {
    id: 3,
    title:
      "Free Computer Course | NIMCET & CUET 2025–2026 Series",
    thumbnail: "https://img.youtube.com/vi/Fn6ngxNn3ds/hqdefault.jpg",
    link: "https://youtube.com/playlist?list=PLjgKXowPULMnNjMybwG1PQxhBhDJeyPIq&si=drVmdEA366-8FTca",
  },

];

const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || 0);
  const minutes = parseInt(match?.[2] || 0);
  const seconds = parseInt(match?.[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

// 🔹 Helper — Convert seconds → readable duration (e.g., 5:30)
const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const TopVideos = () => {
  const [latestVideos, setLatestVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Step 1: Fetch latest uploads
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&type=video&maxResults=15`
        );
        const searchData = await searchRes.json();

        const videoIds = searchData.items
          .map((item) => item.id.videoId)
          .filter(Boolean)
          .join(",");

        // Step 2: Fetch details (for duration)
        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,contentDetails`
        );
        const detailsData = await detailsRes.json();

        // Step 3: Filter — only videos longer than 3 min
        const filtered = detailsData.items
          .map((vid) => ({
            id: vid.id,
            title: vid.snippet.title,
            duration: parseDuration(vid.contentDetails.duration),
            thumbnail: vid.snippet.thumbnails.high.url,
            link: `https://www.youtube.com/watch?v=${vid.id}`,
            date: new Date(vid.snippet.publishedAt),
          }))
          .filter((v) => v.duration > 180) // greater than 3 minutes
          .sort((a, b) => b.date - a.date) // latest first
          .slice(0, 6); // only last 6 videos

        setLatestVideos(filtered);
      } catch (error) {
        console.error("Error fetching latest videos:", error);
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
          {latestVideos.length === 0 ? (
            <p className="text-gray-500 col-span-full text-lg">
              Loading latest videos...
            </p>
          ) : (
            latestVideos.map((video, index) => (
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
                  {/* Duration Tag */}
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
                    Published on{" "}
                    {new Date(video.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </motion.a>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TopVideos;
