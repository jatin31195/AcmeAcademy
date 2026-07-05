"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { BASE_URL } from "@/lib/config";

// Ported from client/src/components/home/ResultSection.jsx. Fetches
// (axios), interval slideshow, requestAnimationFrame marquee — fully Client.
// Plain <img> used throughout: these are dynamic/API-sourced or external
// URLs with dimensions unknown at build time (next/image would need a
// guessed width/height that could distort them).

const AIR1_POSTER =
  "https://res.cloudinary.com/dv69cqfru/image/upload/f_auto,q_auto,w_800/v1783062384/WhatsApp_Image_2026-07-03_at_12.08.09_AM_zglzkd.jpg";

type ResultImage = { photoUrl: string; name?: string; rank?: string | number; exam?: string; year?: string | number };
type Notice = { _id: string; title: string; link: string; tag: string };

const ResultsSection = () => {
  const [resultImages, setResultImages] = useState<ResultImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/get-notices`);
        setNotices(res.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/results/home/result`);
        setResultImages(res.data);
      } catch (error) {
        console.error("Error fetching result images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  useEffect(() => {
    if (!resultImages.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % resultImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [resultImages.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % resultImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + resultImages.length) % resultImages.length);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    let scrollAmount = 0;
    const speed = 0.4;
    const scrollMarquee = () => {
      scrollAmount += speed;
      if (scrollAmount >= marquee.scrollHeight / 2) scrollAmount = 0;
      marquee.scrollTop = scrollAmount;
      requestAnimationFrame(scrollMarquee);
    };
    scrollMarquee();
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            Outstanding <span className="text-primary gradient-text">Results</span>
          </h2>
          <p className="text-lg text-muted-foreground">Celebrating the success of our MCA entrance exam toppers</p>
        </div>

        {/* AIR-1 highlight, static so it's present on first paint, not gated behind the API fetch below */}
        <div className="mb-8 grid md:grid-cols-[0.8fr_1.2fr] gap-6 items-center bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-3xl shadow-lg p-5 sm:p-7">
          <figure className="order-1 max-w-[300px] sm:max-w-[340px] md:max-w-full mx-auto md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AIR1_POSTER}
              alt="ACME Academy NIMCET 2026 AIR 1 achievement poster featuring Kartik Sharma"
              loading="lazy"
              className="rounded-xl shadow-lg w-full aspect-square object-cover"
            />
            <figcaption className="text-sm text-muted-foreground mt-3 text-center md:text-left">
              Kartik Sharma topping the NIMCET 2026 merit list with All India Rank 1, mentored at ACME Academy.
            </figcaption>
          </figure>

          <div className="order-2 text-center md:text-left bg-white/50 backdrop-blur-lg border border-white shadow-xl rounded-2xl p-5 sm:p-6">
            <p className="inline-block text-xs font-semibold tracking-wide uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              NIMCET 2026 Result
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Kartik Sharma, <span className="text-primary gradient-text">AIR 1</span> in{" "}
              <span className="text-primary gradient-text">NIMCET 2026</span>
            </h3>
            <p className="text-muted-foreground mt-2">
              ACME Academy student Kartik Sharma topped the national merit list in NIMCET 2026, after preparing since November
              2024 and giving over 250 tests through ACME&apos;s test series.
            </p>
            <p className="text-gray-700 italic mt-3 text-sm border-l-2 border-primary/30 pl-3">
              &quot;By the time I sat in the actual exam, that kind of pressure wasn&apos;t new to me anymore,&quot; says Kartik,
              who also thanks mentors Kartik sir and Sohail sir for clearing his doubts along the way.
            </p>
            <Link
              href="/nimcet-2026-air-1-kartik-sharma"
              className="inline-block mt-4 text-amber-600 font-semibold hover:text-amber-700 hover:underline"
            >
              Read Kartik Sharma&apos;s full AIR 1 story →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_0.7fr] gap-10 items-start">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black aspect-[16/9]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-white text-lg">Loading Results...</div>
            ) : resultImages.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current}
                    src={resultImages[current]?.photoUrl}
                    alt={
                      resultImages[current]
                        ? `${resultImages[current]?.name || "ACME Academy topper"} — AIR ${
                            resultImages[current]?.rank ?? "N/A"
                          }, ${resultImages[current]?.exam || "NIMCET"} ${resultImages[current]?.year || ""} | ACME Academy`
                        : "ACME Academy result"
                    }
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                  {resultImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === current ? "bg-white scale-125" : "bg-gray-400 hover:bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white text-lg">No Results Found</div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-end"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 via-indigo-50/90 to-blue-50/90 border border-blue-200 shadow-lg rounded-2xl w-full max-w-md flex flex-col h-[470px]">
              <CardHeader className="pb-3 border-b border-blue-100/70 text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <Bell className="h-5 w-5 text-indigo-600" />
                  Notice Board
                </CardTitle>
              </CardHeader>

              <CardContent className="relative px-4 py-4 flex-1 overflow-hidden">
                <div ref={marqueeRef} className="h-full overflow-hidden">
                  <div className="space-y-3">
                    {notices.length > 0 ? (
                      notices.concat(notices).map((notice, i) => (
                        <motion.a
                          key={`${notice._id}-${i}`}
                          href={notice.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-white/85 border border-gray-200/60 backdrop-blur-md p-3 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-400/60 transition-all duration-300 group"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                              {notice.title}
                            </h5>

                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize
                                ${notice.tag === "exam" && "bg-blue-100 text-blue-700"}
                                ${notice.tag === "result" && "bg-green-100 text-green-700"}
                                ${notice.tag === "video" && "bg-red-100 text-red-700"}
                              `}
                            >
                              {notice.tag}
                            </span>
                          </div>
                        </motion.a>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center">No notices available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <div className="w-full text-center mt-6">
          <Link
            href="/acme-academy-results"
            className="inline-block bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View all NIMCET, CUET-PG &amp; MAH-CET results →
          </Link>
        </div>

        <div className="text-center mt-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="gradient-text">Acme </span> मतलब <span className="gradient-text">Selection </span>की
            <span className="gradient-text"> GUARANTEE</span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
