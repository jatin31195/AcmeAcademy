import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
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
  Dumbbell,
  Library,
  FileText,
  Compass,
  ListChecks,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import { Helmet } from "react-helmet-async";

// ACME's official AIR-1 congratulatory poster — the strongest single asset for the achievement, used as the hero image.
const HERO_IMAGE =
  "https://res.cloudinary.com/dv69cqfru/image/upload/v1783062384/WhatsApp_Image_2026-07-03_at_12.08.09_AM_zglzkd.jpg";
// Clean headshot of Kartik Sharma.
const PORTRAIT_IMAGE =
  "https://res.cloudinary.com/dv69cqfru/image/upload/v1783062383/WhatsApp_Image_2026-07-03_at_12.08.08_AM_1_pij8nx.jpg";
// Authentic Patrika newspaper clipping — shown as-is in Media Coverage, unedited.
const PATRIKA_CLIPPING_IMAGE =
  "https://res.cloudinary.com/dv69cqfru/image/upload/v1783062384/WhatsApp_Image_2026-07-03_at_12.08.07_AM_vrshq3.jpg";

// Interview coverage, starting at the moment the AIR 1 result is discussed.
const YOUTUBE_VIDEO_ID = "BpV5Y93HVzE";
const YOUTUBE_START_SECONDS = 381;

// Set once these exist — each button below stays hidden until its URL is filled in.
const PATRIKA_ARTICLE_URL = "";
const KARTIK_LINKEDIN_URL = "https://www.linkedin.com/in/kartik-sharma-4756362a1/";

// Kartik's own voice note, placed in client/public so it's servable at this path as-is.
const KARTIK_VOICE_AUDIO = "/WhatsApp%20Audio%202026-07-03%20at%208.10.52%20PM.mpeg";

// Kartik's success-story video clip (1080×1920 portrait), hosted on Cloudinary.
const KARTIK_SUCCESS_VIDEO =
  "https://res.cloudinary.com/dv69cqfru/video/upload/v1783092183/0703_1_cgt0is.mp4";
// Poster/preview image shown before the success-story video plays.
const KARTIK_SUCCESS_VIDEO_POSTER =
  "https://res.cloudinary.com/dv69cqfru/image/upload/v1783092934/Screenshot_2026-07-03_210401_jqcf1p.png";

// Cloudinary's "v<timestamp>" path segment is the asset's real upload time —
// reused as VideoObject.uploadDate instead of guessing a date.
const KARTIK_SUCCESS_VIDEO_UPLOAD_DATE = (() => {
  const match = KARTIK_SUCCESS_VIDEO.match(/\/upload\/v(\d+)\//);
  return match ? new Date(Number(match[1]) * 1000).toISOString() : undefined;
})();

const cldOptimize = (url, transform = "f_auto,q_auto") =>
  url.replace("/upload/", `/upload/${transform}/`);

// Dedicated 1200x630 crop for social-share previews (OG/Twitter) — kept separate
// from the hero image transform so the on-page hero is never affected.
const cldSocialImage = (url) =>
  cldOptimize(url, "f_auto,q_auto,w_1200,h_630,c_fill,g_auto");

const cldResponsive = (url, widths = [480, 768, 1080, 1500]) => ({
  src: cldOptimize(url, `f_auto,q_auto,w_${widths[widths.length - 1]}`),
  srcSet: widths
    .map((w) => `${cldOptimize(url, `f_auto,q_auto,w_${w}`)} ${w}w`)
    .join(", "),
});

// Same counting pattern as TrustSection.jsx, reused here for the hero's proof band.
const Counter = ({ end, duration = 1600 }) => {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
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
};

const ProgressiveImage = ({ src, srcSet, sizes, alt, className = "", loading, fetchpriority, style }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={loading}
      fetchpriority={fetchpriority}
      style={style}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
};

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

// Academy-wide trust stats — the same figures used in TrustSection.jsx / About.jsx, reused here as sourced facts.
const trustStats = [
  { icon: Users, value: "2000+", label: "Selections in Last 10 Years" },
  { icon: Award, value: "100+", label: "Students in Top 100" },
  { icon: TrendingUp, value: "92%+", label: "Selection Rate Every Year" },
];

const momentTags = [
  { icon: Sparkles, label: "Smart Strategy" },
  { icon: GraduationCap, label: "Expert Mentorship" },
  { icon: Target, label: "Consistent Practice" },
];

const Air1Story = () => {
  const url = "https://www.acmeacademy.in/nimcet-2026-air-1-kartik-sharma";
  const heroImg = cldResponsive(HERO_IMAGE);
  const reduceMotion = useReducedMotion();

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (audioPlaying) {
      audioEl.pause();
    } else {
      audioEl.play().catch(() => {});
    }
  };

  const [successVideoPlaying, setSuccessVideoPlaying] = useState(false);
  const successVideoRef = useRef(null);

  const toggleSuccessVideo = () => {
    const videoEl = successVideoRef.current;
    if (!videoEl) return;
    if (successVideoPlaying) {
      videoEl.pause();
    } else {
      videoEl.play().catch(() => {});
    }
  };

  const openLightbox = (src) => {
    const idx = galleryImages.findIndex((g) => g.src === src);
    setLightboxIndex(idx === -1 ? 0 : idx);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  const showNext = () => setLightboxIndex((i) => (i + 1) % galleryImages.length);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const current = lightboxIndex !== null ? galleryImages[lightboxIndex] : null;
  const currentLarge = current ? cldOptimize(current.src, "f_auto,q_auto,w_1600") : null;

  const youtubeThumbnail = `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${YOUTUBE_START_SECONDS}&autoplay=1`;
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}&t=${YOUTUBE_START_SECONDS}s`;

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@id": `${url}#person`,
          "@type": "Person",
          "name": "Kartik Sharma",
          "award": "AIR 1, NIMCET 2026",
          "description": "NIMCET 2026 All India Rank 1, ACME Academy student.",
          "image": { "@id": `${url}#image-portrait` },
          "sameAs": [KARTIK_LINKEDIN_URL],
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "ACME Academy",
            "url": "https://www.acmeacademy.in",
          },
        },
        {
          "@id": `${url}#article`,
          "@type": "Article",
          "headline": "Kartik Sharma Secures AIR 1 in NIMCET 2026",
          "description":
            "ACME Academy student Kartik Sharma secured All India Rank 1 in NIMCET 2026, topping the national merit list.",
          "keywords":
            "NIMCET 2026 AIR 1, NIMCET AIR 1, NIMCET topper, NIMCET rank 1, Kartik Sharma NIMCET, NIMCET success story, ACME Academy AIR 1",
          "datePublished": "2026-07-02",
          "dateModified": "2026-07-03",
          "about": { "@id": `${url}#person` },
          "image": { "@id": `${url}#image-poster` },
          "video": [{ "@id": `${url}#video-interview` }, { "@id": `${url}#video-story` }],
          "mentions": [
            {
              "@type": "Thing",
              "name": "NIMCET (NIT MCA Common Entrance Test)",
              "sameAs": [
                "https://nimcet.admissions.nic.in/",
                "https://en.wikipedia.org/wiki/NIT_MCA_Common_Entrance_Test",
              ],
            },
          ],
          "author": {
            "@type": "Organization",
            "name": "ACME Academy",
            "url": "https://www.acmeacademy.in",
          },
          "publisher": {
            "@type": "Organization",
            "name": "ACME Academy",
            "url": "https://www.acmeacademy.in",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.acmeacademy.in/logo.png",
            },
          },
          "mainEntityOfPage": url,
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["#air1-hero-heading", "#air1-story-intro", "#air1-testimonial-quote"],
          },
        },
        {
          "@id": `${url}#video-interview`,
          "@type": "VideoObject",
          "name": "Kartik Sharma NIMCET 2026 AIR 1 — Interview Coverage",
          "description":
            "Video coverage discussing ACME Academy's NIMCET 2026 AIR 1 result, Kartik Sharma.",
          "thumbnailUrl": [youtubeThumbnail],
          "embedUrl": `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${YOUTUBE_START_SECONDS}`,
        },
        {
          // uploadDate is read from the Cloudinary asset's own version timestamp
          // (its real upload time), not invented — matches the asset filename dates.
          "@id": `${url}#video-story`,
          "@type": "VideoObject",
          "name": "Kartik Sharma — NIMCET 2026 AIR 1 Success Story",
          "description":
            "Kartik Sharma, ACME Academy student, shares his NIMCET 2026 AIR 1 success story in his own words.",
          "thumbnailUrl": [cldOptimize(KARTIK_SUCCESS_VIDEO_POSTER)],
          "uploadDate": KARTIK_SUCCESS_VIDEO_UPLOAD_DATE,
          "contentUrl": KARTIK_SUCCESS_VIDEO,
        },
        {
          "@id": `${url}#image-poster`,
          "@type": "ImageObject",
          "contentUrl": cldOptimize(HERO_IMAGE),
          "description": "ACME Academy NIMCET 2026 AIR 1 achievement poster — Kartik Sharma",
          "name": "NIMCET 2026 AIR 1 — Kartik Sharma",
        },
        {
          "@id": `${url}#image-portrait`,
          "@type": "ImageObject",
          "contentUrl": cldOptimize(PORTRAIT_IMAGE),
          "description": "Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026 entrance exam",
          "name": "Kartik Sharma — NIMCET 2026 AIR 1",
        },
        {
          "@id": `${url}#image-patrika`,
          "@type": "ImageObject",
          "contentUrl": cldOptimize(PATRIKA_CLIPPING_IMAGE),
          "description": "National newspaper coverage of ACME Academy's NIMCET 2026 AIR 1 achievement",
          "name": "Patrika Coverage — ACME Academy NIMCET 2026 AIR 1",
        },
        {
          // Kept for search-result rich snippets only — not rendered visually on the page.
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.acmeacademy.in/home" },
            { "@type": "ListItem", "position": 2, "name": "Results", "item": "https://www.acmeacademy.in/acme-academy-results" },
            { "@type": "ListItem", "position": 3, "name": "NIMCET 2026 AIR 1 — Kartik Sharma", "item": url },
          ],
        },
      ],
    }),
    [youtubeThumbnail]
  );

  return (
    <>
      <SEO
        title="Kartik Sharma AIR 1 NIMCET 2026 | ACME Academy Topper Story"
        description="Kartik Sharma, an ACME Academy student, secured AIR 1 in NIMCET 2026, India's top rank. Read his preparation journey, mentorship, and media coverage."
        url={url}
        image={cldSocialImage(HERO_IMAGE)}
        imageAlt="Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026"
        keywords="NIMCET 2026 AIR 1, NIMCET AIR 1, NIMCET topper, NIMCET rank 1, Kartik Sharma NIMCET, NIMCET success story, NIMCET preparation strategy, ACME Academy AIR 1"
        jsonLd={jsonLd}
        type="article"
        publishedTime="2026-07-02T00:00:00+05:30"
        modifiedTime="2026-07-03T00:00:00+05:30"
      />
      <Helmet>
        <link rel="preload" as="image" href={heroImg.src} imageSrcSet={heroImg.srcSet} fetchpriority="high" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        {/* ============================= HERO (untouched — already good) ============================= */}
        <section className="relative pt-16 pb-10 sm:pt-20 sm:pb-14 overflow-hidden hero-gradient">
          {/* Golden achievement glow, layered behind the portrait */}
          <div className="absolute top-1/4 right-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-yellow-400/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            {/* Text column */}
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
                ACME Academy Student. India's Pride.
              </motion.p>

              <motion.p
                id="air1-story-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/80 max-w-xl mx-auto lg:mx-0 mb-1 text-sm sm:text-base"
              >
                Extraordinary hard work. Unwavering dedication. Right guidance. That's the ACME way.
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
                <Link to="/acme-courses">
                  <Button variant="outline" className="bg-transparent rounded-full px-7 py-3 font-semibold border-white/40 text-white hover:bg-white/10 hover:text-white">
                    Join ACME Academy
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Photo column */}
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
                  <ProgressiveImage
                    {...cldResponsive(PORTRAIT_IMAGE, [400, 600, 800])}
                    alt="Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026"
                    fetchpriority="high"
                    style={{ aspectRatio: "4 / 5" }}
                    className="w-full h-auto object-cover"
                  />
                </button>

                {/* Achievement shield badge */}
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

              {/* Glass proof strip */}
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

          {/* Scroll indicator */}
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

        {/* ============================= TRUST STAT BAND — white, matches Results.jsx/Home.jsx below-hero convention ============================= */}
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
                  to="/about"
                  className="group flex flex-col items-center justify-center h-full rounded-2xl px-4 py-6 text-center border border-gray-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="mx-auto mb-3 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-primary group-hover:underline">
                    India's Most Trusted MCA Academy
                  </p>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================= SUCCESS STORY ============================= */}
        {/*
          Quote below is a grammar-polished rendering of Kartik's own words from his
          voice note — every fact in it (Nov 2024 start, Oct 2025 joining ACME, 250+
          tests, Quant lectures, Sohail/Kartik sir mentorship) traces directly to the
          transcript. His hometown and one unclear line from the transcript were left
          out rather than guessed at.
        */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
              Kartik Sharma's <span className="gradient-text">Success Story</span>
            </h2>
            <p className="text-center text-xs text-muted-foreground mb-10">
              Published July 2, 2026 · Updated July 3, 2026
            </p>
            <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left: success-story video (1080×1920 portrait), with a play/pause button
                    anchored to its bottom-left corner. Poster image shows before playback.
                    object-contain (not cover) so the full frame stays visible at the shorter
                    height instead of being cropped. */}
                <div
                  className="relative w-full max-w-xs mx-auto md:max-w-sm rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-black aspect-[3/4]"
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
                  {/* Dark scrim behind the corner button so it stays visible over any part of
                      the poster/video, not just when that corner happens to be dark. */}
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

                {/* Right: story text + audio play button */}
                <div className="text-center md:text-left">
                  <Quote className="w-10 h-10 text-primary/40 mb-4 mx-auto md:mx-0" />
                  <p className="text-gray-800 text-lg leading-relaxed font-serif italic">
                    "I started preparing for NIMCET in November 2024, and joined ACME Academy in
                    October 2025 to sharpen that preparation. Over the next few months I gave more
                    than 250 tests through ACME's test series, and the difficulty pushed me hard —
                    by the time I sat in the actual exam, that kind of pressure wasn't new to me
                    anymore. Whenever I struggled with a Quant topic, ACME's lectures helped me
                    work through it, and mentors like Kartik sir and Sohail sir were always
                    available to clear my doubts. Kartik sir, in particular, played a big role in
                    this result, and I'm truly thankful for his guidance."
                  </p>
                  <p className="font-semibold text-gray-900 mt-6">Kartik Sharma, AIR 1, NIMCET 2026</p>

                  {/* Real audio element + custom play/pause button — visitors can hear Kartik's own voice note */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col items-center md:items-start gap-3">
                    <audio
                      ref={audioRef}
                      onPlay={() => setAudioPlaying(true)}
                      onPause={() => setAudioPlaying(false)}
                      onEnded={() => setAudioPlaying(false)}
                      preload="none"
                    >
                      <source src={KARTIK_VOICE_AUDIO} type="audio/mpeg" />
                    </audio>
                    <button
                      type="button"
                      onClick={toggleAudio}
                      className="inline-flex items-center gap-3 bg-white border border-gray-200 shadow-sm hover:border-primary/40 hover:shadow-md rounded-full pl-3 pr-5 py-2 transition-all"
                      aria-pressed={audioPlaying}
                      aria-label={audioPlaying ? "Pause Kartik's voice note" : "Play Kartik's voice note"}
                    >
                      <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                        {audioPlaying ? (
                          <Pause className="w-4 h-4 text-white fill-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        )}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {audioPlaying ? "Playing Kartik's voice note…" : "Listen to Kartik in His Own Voice"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= CONNECT + INTERVIEW ============================= */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid gap-10 items-center lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Connect with <span className="gradient-text">Kartik</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Kartik's story doesn't end here — connect with him directly below.
                </p>
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
                        <span className="text-xs font-semibold text-primary whitespace-nowrap">
                          {s.cta}
                        </span>
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
                      Have a question for Kartik? Send it through ACME Academy and we'll pass it
                      on to him directly.
                    </p>
                    <Link
                      to="/contact-acme-academy"
                      className="inline-block text-sm font-semibold text-primary hover:underline mt-1"
                    >
                      Send a Query →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Video card */}
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
                          <p className="text-yellow-300 font-bold text-lg sm:text-xl mt-1">
                            Interview Coverage
                          </p>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
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

        {/* ============================= A MOMENT OF PRIDE ============================= */}
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

            {/* One card, three frames: story+tags+CTA+testimonial on the left,
                poster + Patrika coverage stacked on the right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-10"
            >
              <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-start">
                {/* Left: story, tags, CTA, testimonial */}
                <div className="text-center md:text-left">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <span className="font-semibold text-primary">Kartik Sharma</span>{" "}
                    has made history by securing All India Rank 1 in NIMCET 2026, the NIT MCA
                    Common Entrance Test for admission to MCA programs at India's NITs.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    It reflects months of relentless mock-test practice, sustained focus on his
                    weaker subjects, and mentorship from ACME Academy's faculty, including Dr.
                    Kartikey Pandey.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                    {momentTags.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2"
                      >
                        <t.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-800">{t.label}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/acme-academy-results/nimcet/2026">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold">
                      View Full NIMCET 2026 Result
                    </Button>
                  </Link>

                  {/* Testimonial — avatar + quote, part of the same left column */}
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
                        <ProgressiveImage
                          {...cldResponsive(PORTRAIT_IMAGE, [200, 300])}
                          alt="Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026"
                          loading="lazy"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-primary/20 mx-auto"
                        />
                      </button>
                      <div>
                        <Quote className="w-6 h-6 text-primary/40 mb-2 mx-auto sm:mx-0" />
                        <p id="air1-testimonial-quote" className="text-gray-800 leading-relaxed italic">
                          "I always dreamed of the top rank, but I stayed focused on my preparation
                          instead of worrying about the result. ACME Academy gave me the right
                          strategy and the mentorship to make it possible."
                        </p>
                        <p className="font-semibold text-gray-900 mt-3">Kartik Sharma</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: poster on top, Patrika coverage below */}
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
                      <ProgressiveImage
                        {...cldResponsive(HERO_IMAGE, [400, 600])}
                        alt="ACME Academy NIMCET 2026 AIR 1 achievement poster featuring Kartik Sharma"
                        loading="lazy"
                        style={{ aspectRatio: '1 / 1' }}
                        className="w-full h-auto"
                      />
                    </button>
                    <figcaption className="sr-only">
                      ACME Academy's official NIMCET 2026 AIR 1 announcement poster for Kartik Sharma.
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
                      <ProgressiveImage
                        {...cldResponsive(PATRIKA_CLIPPING_IMAGE, [400, 600])}
                        alt="Patrika newspaper clipping covering ACME Academy's NIMCET 2026 AIR 1 result"
                        loading="lazy"
                        style={{ aspectRatio: '1568 / 1003' }}
                        className="rounded-xl w-full h-auto"
                      />
                    </button>
                    <figcaption className="text-xs text-muted-foreground mt-3 text-center">
                      Patrika, one of India's leading newspapers, covered ACME Academy's NIMCET
                      2026 AIR 1 result.
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

        {/* ============================= YOUR DREAM. OUR MISSION. (final CTA) ============================= */}
        <section className="py-20 bg-white border-t border-gray-200 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Dream. <span className="gradient-text">Our Mission.</span>
            </h2>
            <p className="text-muted-foreground mb-10">
              Join ACME Academy and be the next success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link to="/contact-acme-academy">
                <Button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:from-indigo-700 hover:to-pink-700 px-8 py-3 rounded-full shadow-lg font-semibold">
                  Start Your Journey
                  <ChevronDown className="w-4 h-4 -rotate-90 ml-1" />
                </Button>
              </Link>
              <Link to="/contact-acme-academy">
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
              <img
                src={currentLarge}
                alt={current.alt}
                className="max-w-full max-h-[75vh] rounded-xl shadow-2xl"
              />
              <figcaption className="text-white/80 text-sm mt-3 text-center">
                {current.caption}
              </figcaption>
              <p className="text-white/50 text-xs mt-1">
                {lightboxIndex + 1} / {galleryImages.length}
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
};

export default Air1Story;
