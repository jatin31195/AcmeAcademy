"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2, Filter, Award, BookOpen } from "lucide-react";
import PastGallery from "@/components/results/past-gallery";
import { BASE_URL } from "@/lib/config";
import {
  optimizeCloudinaryUrl,
  buildResultSrcSet,
  getResultLabel,
  getResultAltText,
  getAnchorId,
  buildToppersIntro,
  PAST_GALLERY_SLUG,
  type ResultDoc,
} from "@/lib/results-helpers";

// Ported from client/src/pages/Results.jsx — the most complex page in the
// migration. All filtering/sorting/URL-sync/cascading-fetch/dedup logic is
// preserved exactly; only the router hooks are adapted (useParams -> props
// from the Server page, useNavigate -> useRouter().push, Link -> next/link).
// Server-rendered metadata/JSON-LD (in the 3 page.tsx wrappers) cover the
// initial-load SEO case for whatever URL a crawler hits; this component's own
// dynamic re-fetching after user filter changes is unchanged client behavior
// (the original's client-side Helmet re-injection on filter change never
// actually reached crawlers either, since it only ever ran post-hydration —
// dropping it here loses nothing crawlers could see before).
export function ResultsClient({
  initialExam,
  initialYear,
  initialResults = [],
}: {
  initialExam: string;
  initialYear: string;
  initialResults?: ResultDoc[];
}) {
  const router = useRouter();
  const [availableYears, setAvailableYears] = useState<(string | number)[]>([]);
  const [availableExams, setAvailableExams] = useState<string[]>([]);
  // Seeded from the Server Component's fetch (same endpoints this effect
  // below re-fetches on the client) so the initial HTML — and the first
  // client render before hydration's effects run — already contains real
  // topper cards/names/photos/ranks instead of an empty state. The
  // subsequent client fetch effect is unchanged and will refresh this
  // exact same data once mounted, same as before this prop existed.
  const [results, setResults] = useState<ResultDoc[]>(initialResults);
  const [combined, setCombined] = useState<ResultDoc[]>([]);
  const [loading, setLoading] = useState(initialResults.length === 0);
  const [selectedExam, setSelectedExam] = useState(initialExam);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const genericText = [
    "At ACME Academy, we don't just teach — we mentor, inspire, and transform.",
    "Our structured NIMCET programs, expert faculty, and proven strategies empower students to unlock their full potential.",
  ];

  // Real, visible topper names in the first on-page paragraph (not just the
  // <meta description>) — Google's snippet generation often prefers visible
  // page text, so this keeps the rendered HTML and the metadata in sync for
  // a specific exam+year view. Falls back to the generic brand copy for the
  // unfiltered "All"/"PastGallery" views where no single result set applies.
  // (Named distinctly from the `isFilteredView` computed below from
  // `mainResults`, which also excludes "MIXED" — this one only needs to know
  // whether a single exam+year is selected, ahead of that later memo.)
  const hasSpecificResultsView = selectedYear !== "All" && selectedYear !== "PastGallery";
  const toppersIntro = hasSpecificResultsView ? buildToppersIntro(results, selectedExam, selectedYear) : null;
  const text = toppersIntro ? [toppersIntro, genericText[1]] : genericText;

  useEffect(() => {
    if (selectedYear === "All") router.push(`/acme-academy-results`);
    else if (selectedYear === "PastGallery") router.push(`/acme-academy-results/${PAST_GALLERY_SLUG}`);
    else router.push(`/acme-academy-results/${selectedExam.toLowerCase()}/${selectedYear}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExam, selectedYear]);

  // Keeps state in sync when the URL param itself is the source of truth
  // (direct load, back/forward navigation) — this route and the plain year
  // route share the same page.tsx, so the Client Component isn't remounted
  // when navigating between them; without this, back/forward into the Past
  // Gallery view left stale year-view state on screen. Ported verbatim from
  // Results.jsx's equivalent effect (which watched useParams()'s `year`).
  useEffect(() => {
    if (initialYear === PAST_GALLERY_SLUG && selectedYear !== "PastGallery") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resync from URL param on back/forward nav, ported behavior
      setSelectedYear("PastGallery");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialYear]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/results/exams`);
        setAvailableExams(["MIXED", ...data]);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setAvailableExams(["MIXED", "NIMCET"]);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        if (!selectedExam) return;

        if (selectedExam === "MIXED") {
          setAvailableYears(["All", "PastGallery"]);
          setSelectedYear("All");
          return;
        }

        const { data } = await axios.get(`${BASE_URL}/api/results/years/${selectedExam.toLowerCase()}`);

        const numericYears = (data || []).filter((y: unknown): y is number => typeof y === "number" && !isNaN(y)).sort((a: number, b: number) => b - a);

        const finalYears = ["All", ...numericYears, "PastGallery"];
        setAvailableYears(finalYears);

        if (
          selectedYear !== "All" &&
          selectedYear !== "PastGallery" &&
          !numericYears.includes(Number(selectedYear)) &&
          numericYears.length > 0
        ) {
          setSelectedYear(String(numericYears[0]));
        }
      } catch (err) {
        console.error("Error fetching years:", err);
        setAvailableYears(["All", "PastGallery"]);
        setSelectedYear("All");
      }
    };

    fetchYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExam]);

  // True only for the very first run of the effect below, and only when the
  // Server Component already supplied initialResults for this exact
  // exam/year — lets that one run skip the redundant duplicate network
  // call (and the loading flash that would hide the already-rendered SSR
  // content) without touching the fetch/branch logic used for every
  // subsequent filter change, which is unchanged.
  const skipInitialMainFetchRef = useRef(initialResults.length > 0);

  useEffect(() => {
    const fetchResults = async () => {
      const skipMainFetch = skipInitialMainFetchRef.current;
      skipInitialMainFetchRef.current = false;

      try {
        if (!skipMainFetch) setLoading(true);

        if (selectedExam === "MIXED") {
          const { data: exams } = await axios.get(`${BASE_URL}/api/results/exams`);
          const examUrls = exams.map((exam: string) => `${BASE_URL}/api/results/top/${exam.toLowerCase()}`);

          const allExamResults = await Promise.all(examUrls.map((url: string) => axios.get(url).then((res) => res.data).catch(() => [])));

          const mixedCombined = allExamResults.flat().sort((a: ResultDoc, b: ResultDoc) => {
            if (a.rank && b.rank) return a.rank - b.rank;
            if (a.rank && !b.rank) return -1;
            if (!a.rank && b.rank) return 1;
            if (a.score && b.score) return b.score - a.score;
            return 0;
          });

          setResults(mixedCombined.slice(0, 12));
          return;
        }

        if (selectedYear === "All") {
          const { data: allYears } = await axios.get(`${BASE_URL}/api/results/years/${selectedExam.toLowerCase()}`);
          const validYears = (allYears || []).filter((y: unknown) => typeof y === "number");
          const yearUrls = validYears.map((y: number) => `${BASE_URL}/api/results/${selectedExam.toLowerCase()}/${y}`);

          const allYearResults = await Promise.all(yearUrls.map((url: string) => axios.get(url).then((res) => res.data).catch(() => [])));

          const combinedAllYears = allYearResults.flat().sort((a: ResultDoc, b: ResultDoc) => {
            if (a.rank && b.rank) return a.rank - b.rank;
            if (a.rank && !b.rank) return -1;
            if (!a.rank && b.rank) return 1;
            if (a.score && b.score) return b.score - a.score;
            return 0;
          });

          setResults(combinedAllYears.slice(0, 12));
          return;
        }

        if (selectedYear === "PastGallery") {
          if (!skipMainFetch) {
            const { data } = await axios.get(`${BASE_URL}/api/results/gallery/all`);
            setResults(data || []);
          }
          return;
        }

        if (!skipMainFetch) {
          const mainUrl = `${BASE_URL}/api/results/${selectedExam.toLowerCase()}/${selectedYear}`;
          const { data: mainData } = await axios.get(mainUrl);
          setResults(mainData || []);
        }

        const allExams = ["nimcet", "vit", "mahcet", "priority"];
        const otherExams = allExams.filter((exam) => exam.toUpperCase() !== selectedExam.toUpperCase());
        const years = [2025, 2024, 2023, 2022, 2021];

        const otherExamUrls: string[] = [];
        for (const exam of otherExams) {
          for (const year of years) {
            otherExamUrls.push(`${BASE_URL}/api/results/${exam}/${year}`);
          }
        }

        otherExamUrls.push(`${BASE_URL}/api/results/combined`);

        const otherResultsPromises = otherExamUrls.map((url) => axios.get(url).then((res) => res.data).catch(() => []));

        const allOtherData = await Promise.all(otherResultsPromises);
        const merged = allOtherData.flat();
        setCombined(merged || []);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedExam, selectedYear]);

  const { mainResults } = useMemo(() => {
    const main = results.filter((r) => (r.exam?.toUpperCase() || "") === selectedExam.toUpperCase());

    main.sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      if (a.rank && !b.rank) return -1;
      if (!a.rank && b.rank) return 1;
      if (a.score && b.score) return b.score - a.score;
      return 0;
    });

    return { mainResults: main };
  }, [results, selectedExam]);

  const topPerformers = mainResults.slice(0, 4);
  const remainingResults = mainResults.slice(4);

  const isFilteredView = selectedYear !== "All" && selectedYear !== "PastGallery" && selectedExam !== "MIXED";

  const faqItems = useMemo(() => {
    if (!isFilteredView || mainResults.length === 0) return [];
    const top = mainResults[0];
    const topLabel = getResultLabel(top, selectedExam);
    const items = [
      {
        q: `Who secured the top rank in ${selectedExam} ${selectedYear} from ACME Academy?`,
        a: `${top.name || "An ACME Academy student"} secured ${topLabel} in ${selectedExam} ${selectedYear} — one of ${mainResults.length} ACME Academy ${selectedExam} ${selectedYear} selections featured on this page.`,
      },
      {
        q: `How many ACME Academy students cleared ${selectedExam} ${selectedYear}?`,
        a: `This page currently showcases ${mainResults.length} ACME Academy ${selectedExam} ${selectedYear} results, including All India Ranks and scores achieved by our students.`,
      },
    ];
    if (mainResults.length > 1) {
      const last = mainResults[mainResults.length - 1];
      items.push({
        q: `What rank range have ACME Academy toppers achieved in ${selectedExam} ${selectedYear}?`,
        a: `ACME Academy ${selectedExam} ${selectedYear} results shown here range from ${topLabel} up to ${getResultLabel(last, selectedExam)}.`,
      });
    }
    return items;
  }, [mainResults, isFilteredView, selectedExam, selectedYear]);

  const renderCard = (
    r: ResultDoc,
    { featured = false, idPrefix = "", priority = false }: { featured?: boolean; idPrefix?: string; priority?: boolean } = {}
  ) => {
    const isAir1Nimcet2026 = r.rank === 1 && String(r.year) === "2026" && r.exam?.toUpperCase() === "NIMCET";

    const anchorId = `${idPrefix}${getAnchorId(r)}`;
    const rawImage = r.photoUrl || r.url;
    const imgSrc = optimizeCloudinaryUrl(rawImage, featured ? 800 : 600) || rawImage;
    const srcSet = buildResultSrcSet(rawImage);
    const altText = getResultAltText(r, selectedExam);
    const label = getResultLabel(r, selectedExam);
    const imgWidth = featured ? 800 : 600;
    const imgHeight = featured ? 600 : 450;

    const card = (
      <motion.article
        key={r._id || r.url}
        id={anchorId}
        aria-label={`${r.name || r.eventName} — ${label}, ${(r.exam || selectedExam).toUpperCase()} ${r.year}`}
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -6, scale: 1.03 }}
        className={`relative rounded-md shadow-md hover:shadow-2xl bg-white border transition-all duration-500 overflow-hidden group scroll-mt-24 ${
          featured ? "border-indigo-300 ring-1 ring-indigo-200" : "border-gray-200"
        }`}
      >
        {featured && (
          <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-indigo-600 text-white text-[11px] font-semibold px-2 py-1 shadow">
            <Award className="h-3 w-3" aria-hidden="true" /> Top Performer
          </span>
        )}
        <figure className="m-0">
          <div className={`relative overflow-hidden ${featured ? "h-56 sm:h-64" : "h-44 sm:h-52"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              srcSet={srcSet}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
              alt={altText}
              width={imgWidth}
              height={imgHeight}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <figcaption className="p-4 text-center">
            <h3 className="text-base font-semibold text-purple-600 group-hover:text-indigo-700 transition">{r.name || r.eventName}</h3>

            <p className="font-semibold text-sm text-gray-600 mt-1">
              <span className={`font-medium ${r.rank ? "text-indigo-600" : r.score ? "text-green-600" : "text-gray-600"}`}>{label}</span> |{" "}
              {(r.exam || selectedExam)?.toString().toUpperCase()} {r.year}
            </p>
          </figcaption>
        </figure>
      </motion.article>
    );

    return isAir1Nimcet2026 ? (
      <Link key={r._id || r.url} href="/nimcet-2026-air-1-kartik-sharma" aria-label="Read Kartik Sharma's full AIR 1 story">
        {card}
      </Link>
    ) : (
      card
    );
  };

  const renderSidebarCard = (r: ResultDoc) => {
    const anchorId = `side-${getAnchorId(r)}`;
    const rawImage = r.photoUrl || r.url;
    const imgSrc = optimizeCloudinaryUrl(rawImage, 400) || rawImage;
    const altText = getResultAltText(r, selectedExam);

    return (
      <motion.article
        key={r._id || r.url}
        id={anchorId}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.02 }}
        className="relative rounded-md shadow-md bg-white border border-gray-200 overflow-hidden group
                 max-w-[260px] sm:max-w-[300px] lg:max-w-full mx-auto scroll-mt-24"
      >
        <figure className="m-0">
          <div className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={altText}
              width={400}
              height={300}
              loading="lazy"
              decoding="async"
              className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              style={{ objectFit: "contain", display: "block", backgroundColor: "#fff" }}
            />
          </div>
          <figcaption className="sr-only">{altText}</figcaption>
        </figure>
      </motion.article>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <section className="relative py-12 sm:py-20 md:py-22 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">Our</span>{" "}
            <span className="text-white">Top Achievers</span>
          </motion.h1>

          <div className="mt-8 max-w-3xl mx-auto space-y-5 text-white/90">
            {text.map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.6 }}>
                {line}
              </motion.p>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center text-gray-900 mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Trophy className="inline-block w-8 h-8 text-yellow-500 mb-1 mr-2" aria-hidden="true" />
            Our Top Performers
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              className="absolute top-0 right-0 w-24 opacity-10 pointer-events-none"
            />
          </motion.h2>

          <motion.div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10 justify-center items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="h-5 w-5" />
              <span>Filter by:</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 font-medium shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition w-36 sm:w-auto"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year === "All" ? "All Years" : year === "PastGallery" ? "Past Gallery" : year}
                  </option>
                ))}
              </select>

              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 font-medium shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition w-36 sm:w-auto"
              >
                {availableExams.map((examName) => (
                  <option key={examName} value={examName}>
                    {examName}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
              <p className="ml-3 text-gray-600 text-lg">Loading results...</p>
            </div>
          ) : selectedYear === "PastGallery" ? (
            <PastGallery galleryData={results} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] gap-8">
              <div>
                {(topPerformers.length > 0 || remainingResults.length > 0) && (
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    All {selectedExam} {selectedYear} Selections
                  </h3>
                )}

                {topPerformers.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                  >
                    {topPerformers.map((r, i) => renderCard(r, { featured: true, priority: i === 0 }))}
                  </motion.div>
                ) : (
                  <p className="text-center text-gray-500 italic py-10"></p>
                )}

                {remainingResults.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                  >
                    {remainingResults.map((r) => renderCard(r))}
                  </motion.div>
                )}

                {(() => {
                  const combinedFiltered = Array.from(new Map(combined.filter((r) => r && r.photoUrl).map((r) => [r.photoUrl, r])).values()).filter(
                    (r) => r.exam?.toLowerCase() !== selectedExam.toLowerCase()
                  );

                  if (combinedFiltered.length === 0) return null;

                  const half = Math.ceil(combinedFiltered.length / 2);
                  const combinedMain = combinedFiltered.slice(0, half);

                  return (
                    <>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mt-8 mb-4">
                        Acme मतलब Selection की GUARANTEE
                      </h3>
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5"
                        initial="hidden"
                        animate="visible"
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                      >
                        {combinedMain.map((r) => renderCard(r, { idPrefix: "combined-" }))}
                      </motion.div>
                    </>
                  );
                })()}
              </div>

              <aside className="space-y-5 lg:w-auto w-[85%] sm:w-[60%] mx-auto lg:mx-0 lg:sticky lg:top-20 self-start h-fit" aria-label="Results from other exams and combined selections">
                {(() => {
                  const combinedFiltered = combined
                    .filter((r) => r.photoType === "combined" || r.exam?.toLowerCase() !== selectedExam.toLowerCase())
                    .filter(
                      (r, index, self) => index === self.findIndex((t) => t._id?.toString() === r._id?.toString() || t.photoUrl === r.photoUrl)
                    );

                  const half = Math.ceil(combinedFiltered.length / 2);
                  let combinedSidebar = combinedFiltered.slice(half);

                  combinedSidebar = combinedSidebar.sort((a, b) => {
                    if (a.photoType === "combined" || b.photoType === "combined") return 0;
                    if (a.rank && b.rank) return a.rank - b.rank;
                    if (a.rank && !b.rank) return -1;
                    if (!a.rank && b.rank) return 1;
                    if (a.score && b.score) return b.score - a.score;

                    return 0;
                  });

                  if (combinedSidebar.length === 0) return <p className="text-center text-gray-500 text-sm italic">No additional results to show.</p>;

                  return combinedSidebar.map(renderSidebarCard);
                })()}
              </aside>
            </div>
          )}
        </div>
      </section>

      {faqItems.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-lg p-4 group">
                  <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {item.q}
                    <span className="text-indigo-600 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold text-gray-900 mb-3">Continue Your MCA Entrance Preparation</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore the same resources our toppers used to prepare for {selectedExam} {selectedYear !== "All" && selectedYear !== "PastGallery" ? selectedYear : ""}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/acme-practice-sets" className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition bg-gray-50">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-medium text-gray-800">Practice Sets</span>
            </Link>
            <Link href="/acme-free-courses" className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition bg-gray-50">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-medium text-gray-800">Free Courses</span>
            </Link>
            <Link href="/exam-pattern" className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition bg-gray-50">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-medium text-gray-800">Exam Pattern</span>
            </Link>
            <Link href="/pyq" className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition bg-gray-50">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-medium text-gray-800">Previous Year Papers</span>
            </Link>
            <Link href="/nimcet-rank-predictor" className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition bg-gray-50">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-medium text-gray-800">Rank Predictor</span>
            </Link>
            <Link href="/score-checker" className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition bg-gray-50">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-medium text-gray-800">Score Checker</span>
            </Link>
            <Link href="/acme-academy-open-library" className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition bg-gray-50">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <span className="font-medium text-gray-800">Open Library</span>
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Read the full story behind{" "}
            <Link href="/nimcet-2026-air-1-kartik-sharma" className="text-indigo-600 font-medium hover:underline">
              Kartik Sharma&apos;s AIR 1 in NIMCET 2026
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-gray-200 text-center">
        <motion.div className="max-w-3xl mx-auto px-6 space-y-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-gray-900 leading-tight">Dream. Prepare. Achieve.</h2>
          <p className="text-lg text-gray-700 font-medium">
            Join <span className="font-semibold text-indigo-600">ACME Academy</span> — where discipline meets excellence, and preparation turns into performance.
          </p>
          <Button
            className="mt-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold text-lg px-10 py-3 rounded-full shadow-lg hover:shadow-pink-400/30 transition-transform hover:scale-105"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Join ACME Now
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
