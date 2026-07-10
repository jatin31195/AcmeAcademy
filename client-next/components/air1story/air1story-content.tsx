"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Newspaper,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Linkedin,
  Play,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Target,
  Users,
  Award,
  TrendingUp,
  Star,
  ShieldCheck,
  UserCheck,
  MessageCircle,
  Quote,
  Pause,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import rankBannerImage from "@/assets/images/rank_banner.jpeg";
import kartikSharmaImage from "@/assets/images/kartik_sharma.jpeg";
import patrikaImage from "@/assets/images/patrika.jpeg";

// Ported from client/src/pages/Air1Story.jsx. Same rationale as About/Contact:
// pervasive framer-motion + heavy local state (lightbox, two video players,
// keyboard nav) makes this one Client Component; metadata/JSON-LD/preload
// link stay in the Server page.tsx wrapper (see that file — the JSON-LD
// there is fully static/deterministic, same values this file used to compute
// client-side via useMemo).

export const HERO_IMAGE = rankBannerImage.src;
export const PORTRAIT_IMAGE = kartikSharmaImage.src;
export const PATRIKA_CLIPPING_IMAGE = patrikaImage.src;

export const YOUTUBE_VIDEO_ID = "BpV5Y93HVzE";
const YOUTUBE_START_SECONDS = 381;

const PATRIKA_ARTICLE_URL = "";
const KARTIK_LINKEDIN_URL = "https://www.linkedin.com/in/kartik-sharma-4756362a1/";

const KARTIK_SUCCESS_VIDEO = "https://res.cloudinary.com/dv69cqfru/video/upload/v1783092183/0703_1_cgt0is.mp4";
const KARTIK_SUCCESS_VIDEO_POSTER =
  "https://res.cloudinary.com/dv69cqfru/image/upload/v1783092934/Screenshot_2026-07-03_210401_jqcf1p.png";

const KARTIK_VOICE_VIDEO = "https://res.cloudinary.com/dv69cqfru/video/upload/v1783226482/0703_1_qjuo31.mp4";
const KARTIK_VOICE_VIDEO_POSTER = KARTIK_VOICE_VIDEO.replace(/\.mp4$/, ".jpg");

const galleryImages = [
  {
    src: HERO_IMAGE,
    alt: "ACME Academy NIMCET 2026 AIR 1 achievement poster featuring Kartik Sharma",
    caption: "ACME Academy's official NIMCET 2026 AIR 1 announcement.",
  },
  {
    src: PORTRAIT_IMAGE,
    alt: "Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026",
    caption: "Kartik Sharma, NIMCET 2026 All India Rank 1.",
  },
  {
    src: PATRIKA_CLIPPING_IMAGE,
    alt: "Patrika newspaper clipping covering ACME Academy's NIMCET 2026 AIR 1 result",
    caption: "Patrika, one of India's leading newspapers, covered ACME Academy's NIMCET 2026 AIR 1 result.",
  },
];

const trustStats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Users, value: "2000+", label: "Selections in Last 10 Years" },
  { icon: Award, value: "100+", label: "Students of Two Digit Rankers in Last 10 Years" },
  { icon: TrendingUp, value: "92%+", label: "Selection Rate Every Year" },
];

const momentTags: { icon: LucideIcon; label: string }[] = [
  { icon: Sparkles, label: "Smart Strategy" },
  { icon: GraduationCap, label: "Expert Mentorship" },
  { icon: Target, label: "Consistent Practice" },
];

function Counter({ end, duration = 1600 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ported as-is from TrustSection.jsx's Counter pattern
      setCount(end);
      return;
    }
    let start = 0;
    const stepTime = Math.max(1, Math.abs(Math.floor(duration / end)));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, duration, reduceMotion]);

  return count;
}

export function Air1StoryContent() {
  const reduceMotion = useReducedMotion();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const [successVideoPlaying, setSuccessVideoPlaying] = useState(false);
  const successVideoRef = useRef<HTMLVideoElement>(null);

  const toggleSuccessVideo = () => {
    const videoEl = successVideoRef.current;
    if (!videoEl) return;
    if (successVideoPlaying) {
      videoEl.pause();
    } else {
      videoEl.play().catch(() => {});
    }
  };

  const [voiceVideoPlaying, setVoiceVideoPlaying] = useState(false);
  const voiceVideoRef = useRef<HTMLVideoElement>(null);

  const toggleVoiceVideo = () => {
    const videoEl = voiceVideoRef.current;
    if (!videoEl) return;
    if (voiceVideoPlaying) {
      videoEl.pause();
    } else {
      videoEl.play().catch(() => {});
    }
  };

  const openLightbox = (src: string) => {
    const idx = galleryImages.findIndex((g) => g.src === src);
    setLightboxIndex(idx === -1 ? 0 : idx);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () => setLightboxIndex((i) => ((i ?? 0) - 1 + galleryImages.length) % galleryImages.length);
  const showNext = () => setLightboxIndex((i) => ((i ?? 0) + 1) % galleryImages.length);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const current = lightboxIndex !== null ? galleryImages[lightboxIndex] : null;
  const currentLarge = current ? current.src : null;

  const youtubeThumbnail = `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${YOUTUBE_START_SECONDS}&autoplay=1`;
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}&t=${YOUTUBE_START_SECONDS}s`;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        {/* HERO */}
        <section className="relative pt-16 pb-10 sm:pt-20 sm:pb-14 overflow-hidden hero-gradient">
          <div className="absolute top-1/4 right-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-yellow-400/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div className="text-center lg:text-left">
              <motion.p
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white/70 tracking-[0.2em] text-sm font-semibold uppercase mb-2"
              >
                NIMCET 2026
              </motion.p>

              <motion.h1
                id="air1-hero-heading"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[clamp(2.2rem,5.5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl mb-3 leading-[1.02]"
              >
                <span className="sr-only">Kartik Sharma – AIR 1, NIMCET 2026: </span>
                <span aria-hidden="true">
                  All India{" "}
                  <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300 text-transparent bg-clip-text">
                    Rank 1
                  </span>
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-3"
              >
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-900 font-bold text-lg sm:text-xl px-5 py-2 rounded-xl shadow-lg">
                  <Trophy className="w-5 h-5" />
                  Kartik Sharma
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-lg sm:text-xl font-semibold text-white/95 mb-2"
              >
                ACME Academy Student. India&apos;s Pride.
              </motion.p>

              <motion.p
                id="air1-story-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/80 max-w-xl mx-auto lg:mx-0 mb-1 text-sm sm:text-base"
              >
                Extraordinary hard work. Unwavering dedication. Right guidance. That&apos;s the ACME way.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="italic text-yellow-200/90 font-serif mb-5 text-sm sm:text-base"
              >
                A Proud Moment for the ACME Family
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <a href="#journey">
                  <Button className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-7 py-3 font-semibold shadow-lg">
                    Explore the Journey
                  </Button>
                </a>
                <Link href="/acme-courses">
                  <Button
                    variant="outline"
                    className="bg-transparent rounded-full px-7 py-3 font-semibold border-white/40 text-white hover:bg-white/10 hover:text-white"
                  >
                    Join ACME Academy
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[220px] sm:max-w-[260px]"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-yellow-300/40 via-pink-300/30 to-indigo-300/30 blur-2xl" />
                <button
                  type="button"
                  onClick={() => openLightbox(PORTRAIT_IMAGE)}
                  className="relative block w-full cursor-zoom-in rounded-[2rem] overflow-hidden ring-4 ring-yellow-300/40 shadow-2xl"
                  aria-label="View full-size photo of Kartik Sharma"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- fixed aspect-ratio crop from a local static asset */}
                  <img
                    src={PORTRAIT_IMAGE}
                    alt="Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026"
                    fetchPriority="high"
                    style={{ aspectRatio: "4 / 5" }}
                    className="w-full h-auto object-cover"
                  />
                </button>

                <motion.div
                  animate={reduceMotion ? {} : { y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden sm:flex absolute top-1/2 -right-5 -translate-y-1/2 flex-col items-center gap-0.5 bg-gradient-to-b from-indigo-600 to-blue-700 rounded-lg shadow-lg px-2 py-1.5 border border-yellow-300/40"
                >
                  <Crown className="w-3 h-3 text-yellow-300" />
                  <p className="text-white font-extrabold text-sm leading-none">
                    AIR<span className="text-yellow-300 ml-0.5">1</span>
                  </p>
                  <p className="text-white/70 text-[8px] font-medium">NIMCET 2026</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Award className="w-2 h-2 text-yellow-300/70" />
                    <Award className="w-2 h-2 text-yellow-300/70" />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="glass rounded-xl mt-3 px-2 py-2 flex divide-x divide-white/20"
              >
                <div className="flex-1 text-center px-1">
                  <p className="text-sm font-bold text-white leading-none">1</p>
                  <p className="text-[9px] text-white/70 mt-0.5 leading-tight">All India Rank</p>
                </div>
                <div className="flex-1 text-center px-1">
                  <p className="text-sm font-bold text-white leading-none">NIMCET</p>
                  <p className="text-[9px] text-white/70 mt-0.5 leading-tight">2026</p>
                </div>
                <div className="flex-1 text-center px-1">
                  <p className="text-sm font-bold text-white leading-none">
                    <Counter end={92} />%
                  </p>
                  <p className="text-[9px] text-white/70 mt-0.5 leading-tight">ACME Selection Ratio</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.a
            href="#journey"
            aria-label="Scroll to journey"
            animate={reduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.a>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
              <path
                d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* TRUST STAT BAND */}
        <section id="journey" className="bg-white border-b border-gray-100 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {trustStats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl px-4 py-6 text-center border border-gray-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="mx-auto mb-3 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{s.label}</p>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: trustStats.length * 0.08 }}
              >
                <Link
                  href="/about"
                  className="group flex flex-col items-center justify-center h-full rounded-2xl px-4 py-6 text-center border border-gray-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="mx-auto mb-3 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-primary group-hover:underline">India&apos;s Most Trusted MCA Academy</p>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SUCCESS STORY */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
              Kartik Sharma&apos;s <span className="gradient-text">Success Story</span>
            </h2>
            <p className="text-center text-xs text-muted-foreground mb-10">Published July 2, 2026 · Updated July 3, 2026</p>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-10">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div
                  className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-black aspect-[3/4]"
                  style={{ aspectRatio: "3 / 4" }}
                >
                  <video
                    ref={successVideoRef}
                    src={KARTIK_SUCCESS_VIDEO}
                    poster={KARTIK_SUCCESS_VIDEO_POSTER}
                    className="absolute inset-0 w-full h-full object-contain"
                    playsInline
                    preload="metadata"
                    onPlay={() => setSuccessVideoPlaying(true)}
                    onPause={() => setSuccessVideoPlaying(false)}
                    onEnded={() => setSuccessVideoPlaying(false)}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <button
                    type="button"
                    onClick={toggleSuccessVideo}
                    className="absolute bottom-3 left-3 z-10 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shadow-xl ring-2 ring-white/80 transition-colors"
                    aria-pressed={successVideoPlaying}
                    aria-label={successVideoPlaying ? "Pause Kartik's success story video" : "Play Kartik's success story video"}
                  >
                    {successVideoPlaying ? (
                      <Pause className="w-5 h-5 text-white fill-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    )}
                  </button>
                </div>

                <div
                  className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-black aspect-[3/4]"
                  style={{ aspectRatio: "3 / 4" }}
                >
                  <video
                    ref={voiceVideoRef}
                    src={KARTIK_VOICE_VIDEO}
                    poster={KARTIK_VOICE_VIDEO_POSTER}
                    className="absolute inset-0 w-full h-full object-contain"
                    playsInline
                    preload="metadata"
                    onPlay={() => setVoiceVideoPlaying(true)}
                    onPause={() => setVoiceVideoPlaying(false)}
                    onEnded={() => setVoiceVideoPlaying(false)}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <button
                    type="button"
                    onClick={toggleVoiceVideo}
                    className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 px-4 py-3"
                    aria-pressed={voiceVideoPlaying}
                    aria-label={voiceVideoPlaying ? "Pause Kartik's voice video" : "Listen to Kartik in his own voice"}
                  >
                    <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/80">
                      {voiceVideoPlaying ? (
                        <Pause className="w-4 h-4 text-white fill-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      )}
                    </span>
                    <span className="text-sm font-semibold text-white text-left drop-shadow">Listen to Kartik in His Own Voice</span>
                  </button>
                </div>

                <div className="text-center md:text-left">
                  <Quote className="w-10 h-10 text-primary/40 mb-4 mx-auto md:mx-0" />
                  <p className="text-gray-800 text-lg leading-relaxed font-serif italic">
                    &quot;I started preparing for NIMCET in November 2024, and joined ACME Academy in October 2025 to sharpen that
                    preparation. Over the next few months I gave more than 250 tests through ACME&apos;s test series, and the
                    difficulty pushed me hard — by the time I sat in the actual exam, that kind of pressure wasn&apos;t new to me
                    anymore. Whenever I struggled with a Quant topic, ACME&apos;s lectures helped me work through it, and mentors
                    like Kartik sir and Sohail sir were always available to clear my doubts. Kartik sir, in particular, played a
                    big role in this result, and I&apos;m truly thankful for his guidance.&quot;
                  </p>
                  <p className="font-semibold text-gray-900 mt-6">Kartik Sharma, AIR 1, NIMCET 2026</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONNECT + INTERVIEW */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid gap-10 items-center lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Connect with <span className="gradient-text">Kartik</span>
                </h2>
                <p className="text-muted-foreground mb-8">Kartik&apos;s story doesn&apos;t end here — connect with him directly below.</p>
                <div className="space-y-4">
                  {[
                    {
                      href: KARTIK_LINKEDIN_URL,
                      icon: Linkedin,
                      color: "#0A66C2",
                      title: "LinkedIn",
                      subtitle: "Connect with Kartik",
                      cta: "View Profile",
                    },
                    {
                      href: youtubeWatchUrl,
                      icon: Play,
                      color: "#FF0000",
                      title: "YouTube",
                      subtitle: "Watch his interview",
                      cta: "Watch Now",
                    },
                  ].map((s, i) =>
                    s.href ? (
                      <motion.a
                        key={i}
                        whileHover={{ y: -3 }}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl shadow-md px-5 py-4 hover:shadow-xl hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl" style={{ backgroundColor: `${s.color}1a` }}>
                            <s.icon className="w-5 h-5" style={{ color: s.color }} />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                              {s.title}
                              <BadgeCheck className="w-3.5 h-3.5 text-primary" aria-label="Verified" />
                            </p>
                            <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-primary whitespace-nowrap">{s.cta}</span>
                      </motion.a>
                    ) : null
                  )}
                </div>

                <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4 mt-4">
                  <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Have a question for Kartik? Send it through ACME Academy and we&apos;ll pass it on to him directly.
                    </p>
                    <Link href="/contact-acme-academy" className="inline-block text-sm font-semibold text-primary hover:underline mt-1">
                      Send a Query →
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400/40 via-indigo-400/40 to-purple-400/40 blur-xl" />
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                    {videoPlaying ? (
                      <iframe
                        className="w-full h-full"
                        src={youtubeEmbedUrl}
                        title="Kartik Sharma NIMCET 2026 AIR 1 Interview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setVideoPlaying(true)}
                        className="group relative block w-full h-full cursor-pointer"
                        aria-label="Play interview video"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail URL, ported as-is */}
                        <img
                          src={youtubeThumbnail}
                          alt="Kartik Sharma NIMCET 2026 AIR 1 interview video thumbnail"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/70 transition-colors" />
                        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-left">
                          <p className="text-white font-semibold text-sm sm:text-base leading-tight">
                            Kartik Sharma
                            <br />
                            AIR 1 – NIMCET 2026
                          </p>
                          <p className="text-yellow-300 font-bold text-lg sm:text-xl mt-1">Interview Coverage</p>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} className="absolute inset-0 flex items-center justify-center">
                          <div className="glass rounded-full p-5 sm:p-6 shadow-2xl">
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
                          </div>
                        </motion.div>
                      </button>
                    )}
                  </div>
                </div>
                <a
                  href={youtubeWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mt-4 text-sm"
                >
                  Watch on YouTube
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* A MOMENT OF PRIDE */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-center mb-10"
            >
              A Moment of <span className="gradient-text">Pride</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-10"
            >
              <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-start">
                <div className="text-center md:text-left">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <span className="font-semibold text-primary">Kartik Sharma</span> has made history by securing All India Rank
                    1 in NIMCET 2026, the NIT MCA Common Entrance Test for admission to MCA programs at India&apos;s NITs.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    It reflects months of relentless mock-test practice, sustained focus on his weaker subjects, and mentorship
                    from ACME Academy&apos;s faculty, including Dr. Kartikey Pandey.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                    {momentTags.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                        <t.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-800">{t.label}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/acme-academy-results/nimcet/2026">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold">
                      View Full NIMCET 2026 Result
                    </Button>
                  </Link>

                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold mb-5">
                      Words That <span className="gradient-text">Inspire</span>
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                      <button
                        type="button"
                        onClick={() => openLightbox(PORTRAIT_IMAGE)}
                        className="shrink-0 cursor-zoom-in"
                        aria-label="View full-size photo of Kartik Sharma"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- small avatar crop from a local static asset */}
                        <img
                          src={PORTRAIT_IMAGE}
                          alt="Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026"
                          loading="lazy"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-primary/20 mx-auto"
                        />
                      </button>
                      <div>
                        <Quote className="w-6 h-6 text-primary/40 mb-2 mx-auto sm:mx-0" />
                        <p id="air1-testimonial-quote" className="text-gray-800 leading-relaxed italic">
                          &quot;I always dreamed of the top rank, but I stayed focused on my preparation instead of worrying about
                          the result. ACME Academy gave me the right strategy and the mentorship to make it possible.&quot;
                        </p>
                        <p className="font-semibold text-gray-900 mt-3">Kartik Sharma</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <motion.figure
                    className="m-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(HERO_IMAGE)}
                      className="block w-full cursor-zoom-in rounded-2xl overflow-hidden shadow-xl border border-gray-200"
                      aria-label="View full-size AIR 1 poster"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- fixed aspect-ratio crop from a local static asset */}
                      <img
                        src={HERO_IMAGE}
                        alt="ACME Academy NIMCET 2026 AIR 1 achievement poster featuring Kartik Sharma"
                        loading="lazy"
                        style={{ aspectRatio: "1 / 1" }}
                        className="w-full h-auto"
                      />
                    </button>
                    <figcaption className="sr-only">
                      ACME Academy&apos;s official NIMCET 2026 AIR 1 announcement poster for Kartik Sharma.
                    </figcaption>
                  </motion.figure>

                  <motion.figure
                    className="m-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(PATRIKA_CLIPPING_IMAGE)}
                      className="block w-full cursor-zoom-in bg-white rounded-2xl shadow-xl border border-gray-200 p-2"
                      aria-label="View full-size Patrika newspaper coverage"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- fixed aspect-ratio crop from a local static asset */}
                      <img
                        src={PATRIKA_CLIPPING_IMAGE}
                        alt="Patrika newspaper clipping covering ACME Academy's NIMCET 2026 AIR 1 result"
                        loading="lazy"
                        style={{ aspectRatio: "1568 / 1003" }}
                        className="rounded-xl w-full h-auto"
                      />
                    </button>
                    <figcaption className="text-xs text-muted-foreground mt-3 text-center">
                      Patrika, one of India&apos;s leading newspapers, covered ACME Academy&apos;s NIMCET 2026 AIR 1 result.
                    </figcaption>
                    {PATRIKA_ARTICLE_URL && (
                      <a
                        href={PATRIKA_ARTICLE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-primary font-semibold hover:underline mt-2 text-sm"
                      >
                        <Newspaper className="w-4 h-4" />
                        Read Full News Article
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </motion.figure>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* YOUR DREAM. OUR MISSION. */}
        <section className="py-20 bg-white border-t border-gray-200 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Dream. <span className="gradient-text">Our Mission.</span>
            </h2>
            <p className="text-muted-foreground mb-10">Join ACME Academy and be the next success story.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/contact-acme-academy">
                <Button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:from-indigo-700 hover:to-pink-700 px-8 py-3 rounded-full shadow-lg font-semibold">
                  Start Your Journey
                  <ChevronDown className="w-4 h-4 -rotate-90 ml-1" />
                </Button>
              </Link>
              <Link href="/contact-acme-academy">
                <Button variant="outline" className="px-8 py-3 rounded-full font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Talk to Counsellor
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-gray-700 text-sm font-medium">Personalized Guidance</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-gray-700 text-sm font-medium">Proven Results</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <p className="text-gray-700 text-sm font-medium">Expert Mentors</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous image"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-3 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.figure
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[90vh] flex flex-col items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs the raw local asset URL, not next/image */}
              <img src={currentLarge ?? undefined} alt={current.alt} className="max-w-full max-h-[75vh] rounded-xl shadow-2xl" />
              <figcaption className="text-white/80 text-sm mt-3 text-center">{current.caption}</figcaption>
              <p className="text-white/50 text-xs mt-1">
                {(lightboxIndex ?? 0) + 1} / {galleryImages.length}
              </p>
            </motion.figure>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next image"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-3 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
