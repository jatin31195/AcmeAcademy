"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CalendarDays,
  ClipboardList,
  AlertTriangle,
  RefreshCcw,
  Folder,
  ArrowLeft,
  BookOpen,
  BarChart3,
  Sparkles,
  Target,
  Clock3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { FreeTestsResult } from "@/lib/classplus";

const THEME_BUTTON_CLASS =
  "w-full mt-auto bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white hover:opacity-90 border-0";

function formatDate(ms: number | null) {
  if (!ms) return null;
  return new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function categoryBadgeClass(category: "Ongoing" | "Completed") {
  return category === "Ongoing"
    ? "bg-green-500/10 text-green-600 border-green-500/20 shrink-0"
    : "bg-gray-500/10 text-gray-600 border-gray-500/20 shrink-0";
}

function getFolderSummary(folderCount: number, testCount: number) {
  const folderLabel = `${folderCount} folder${folderCount === 1 ? "" : "s"}`;
  const testLabel = `${testCount} test${testCount === 1 ? "" : "s"}`;

  if (folderCount > 0 && testCount > 0) {
    return `${folderLabel} and ${testLabel} inside this folder.`;
  }
  if (folderCount > 0) {
    return `${folderLabel} inside this folder.`;
  }
  if (testCount > 0) {
    return `${testLabel} inside this folder.`;
  }
  return "0 items inside this folder.";
}

export function FreeTestsClient({
  initialData,
  pageSize,
}: {
  initialData: FreeTestsResult;
  pageSize: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const [page, setPage] = useState(0);
  const [folder, setFolder] = useState<{ id: string; name: string } | null>(null);
  const [data, setData] = useState<FreeTestsResult>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [folderPreviewCounts, setFolderPreviewCounts] = useState<Record<string, { folderCount: number; testCount: number }>>({});
  const isFirstRun = useRef(true);
  const { items, total } = data;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const openFolder = (id: string, name: string) => {
    setFolder({ id, name });
    setSearchTerm("");
    setPage(0);
  };

  const exitFolder = () => {
    setFolder(null);
    setSearchTerm("");
    setPage(0);
  };

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(page * pageSize),
      search: debouncedSearch,
    });
    if (folder) params.set("folderId", folder.id);

    fetch(`/api/free-tests?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((result: FreeTestsResult) => {
        setData({
          items: Array.isArray(result.items) ? result.items : [],
          total: typeof result.total === "number" ? result.total : 0,
        });
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedSearch, page, pageSize, retryKey, folder]);

  useEffect(() => {
    const pendingFolders = items.filter(
      (item): item is Extract<typeof items[number], { kind: "folder" }> => item.kind === "folder" && !folderPreviewCounts[item.id],
    );

    if (pendingFolders.length === 0) return;

    const controllers = pendingFolders.map((item) => {
      const params = new URLSearchParams({
        limit: "1000",
        offset: "0",
        search: "",
        folderId: item.id,
      });

      const controller = new AbortController();
      fetch(`/api/free-tests?${params.toString()}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error("Folder preview request failed");
          return res.json();
        })
        .then((result: FreeTestsResult) => {
          const childItems = Array.isArray(result.items) ? result.items : [];
          const folderCount = childItems.filter((child) => child.kind === "folder").length;
          const testCount = childItems.filter((child) => child.kind === "test").length;

          setFolderPreviewCounts((prev) => {
            if (prev[item.id]?.folderCount === folderCount && prev[item.id]?.testCount === testCount) {
              return prev;
            }
            return { ...prev, [item.id]: { folderCount, testCount } };
          });
        })
        .catch(() => undefined);

      return controller;
    });

    return () => {
      controllers.forEach((controller) => controller.abort());
    };
  }, [items, folderPreviewCounts]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // Folders shown before individual tests, stable within each group.
  const sortedItems = [...items].sort((a, b) => {
    if (a.kind === b.kind) return 0;
    return a.kind === "folder" ? -1 : 1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 text-center overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
              ACME Academy
            </span>{" "}
            <span className="text-white">Free Tests</span>
          </motion.h1>
          <p className="font-semibold text-lg text-white/90 max-w-3xl mx-auto mb-8">
            Attempt free mock tests for NIMCET, CUET, MAH-CET, JAMIA, VIT MCA and other MCA entrance exams.
            Practice real exam-level questions completely free.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="text-white absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search free tests..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="font-semibold pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <section className="py-10 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <h2 id="free-tests-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Free NIMCET, CUET PG &amp; MAH-CET Mock Tests
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" /> ACME Free Test Series for serious NIMCET aspirants
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Practice the <span className="text-primary">best NIMCET test series</span> with free mock tests and detailed analysis.
            </h2>
            <p className="text-lg text-muted-foreground leading-8">
              ACME Academy&apos;s free test series helps students prepare for NIMCET, CUET PG, and MAH-CET with realistic mock tests, topic-wise practice, and instant solutions.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-7 text-white shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Why students trust ACME</h3>
            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex gap-3"><Target className="h-5 w-5 mt-0.5 text-cyan-300" /> Real exam-style questions for NIMCET and MCA entrance preparation.</li>
              <li className="flex gap-3"><BarChart3 className="h-5 w-5 mt-0.5 text-cyan-300" /> Performance insights that help identify weak areas quickly.</li>
              <li className="flex gap-3"><Clock3 className="h-5 w-5 mt-0.5 text-cyan-300" /> Timed mock tests to improve speed and confidence.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tests */}
      <section id="free-tests" aria-labelledby="free-tests-heading" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {folder ? (
            <div className="flex items-center gap-3 mb-8">
              <Button variant="outline" size="sm" onClick={exitFolder} aria-label="Back to all free tests">
                <ArrowLeft className="h-4 w-4" /> Back to All Tests
              </Button>
              <h2 className="text-xl font-bold text-gray-800">{folder.name}</h2>
            </div>
          ) : null}

          {loading && <p className="text-center text-muted-foreground py-8">Loading tests...</p>}

          {!loading && error && (
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Couldn&apos;t load tests</h3>
              <p className="text-muted-foreground mb-4">Something went wrong while fetching tests. Please try again.</p>
              <Button variant="outline" onClick={() => setRetryKey((k) => k + 1)}>
                <RefreshCcw className="h-4 w-4" /> Retry
              </Button>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No free tests found</h3>
              <p className="text-muted-foreground">Try a different search term.</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {sortedItems.map((item, index) => {
                  if (item.kind === "folder") {
                    const previewCounts = folderPreviewCounts[item.id];
                    const folderCount = previewCounts?.folderCount ?? item.folderCount;
                    const testCount = previewCounts?.testCount ?? item.testCount;
                    const folderLabel = `${folderCount} folder${folderCount === 1 ? "" : "s"}`;
                    const testLabel = `${testCount} test${testCount === 1 ? "" : "s"}`;
                    const summaryLabel = folderCount > 0 && testCount > 0
                      ? `${folderLabel} and ${testLabel} inside this folder.`
                      : folderCount > 0
                        ? `${folderLabel} inside this folder.`
                        : testCount > 0
                          ? `${testLabel} inside this folder.`
                          : "0 items inside this folder.";

                    return (
                      <button
                        key={`folder-${item.id}`}
                        type="button"
                        onClick={() => openFolder(item.id, item.name)}
                        aria-label={folderCount > 0 && testCount > 0
                          ? `View ${folderLabel} and ${testLabel} inside ${item.name}`
                          : folderCount > 0
                            ? `View ${folderLabel} inside ${item.name}`
                            : testCount > 0
                              ? `View ${testLabel} inside ${item.name}`
                              : `View contents inside ${item.name}`}
                        className="relative h-full w-full text-left appearance-none bg-transparent border-0 p-0 m-0 cursor-pointer group pt-3"
                      >
                        {/* Folder tab, sits above the card body to read as a physical folder */}
                        <div className="absolute top-0 left-6 w-24 h-5 rounded-t-lg bg-amber-300 border-2 border-b-0 border-amber-400 group-hover:bg-amber-200 transition-colors" />
                        <Card className="relative bg-gradient-to-br from-amber-200 to-amber-100 border-2 border-amber-400 rounded-lg rounded-tl-none shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
                          <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-3">
                                <Folder className="h-9 w-9 text-amber-600 shrink-0" strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} />
                                <CardTitle className="text-lg text-amber-900 drop-shadow-none">{item.name}</CardTitle>
                              </div>
                              <Badge className={categoryBadgeClass(item.category)}>{item.category}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-col flex-1">
                            <p className="text-sm text-amber-800/80 flex-1 mb-6">{summaryLabel}</p>
                            <span className="font-semibold flex items-center gap-2 text-amber-700 mt-auto">
                              View Tests →
                            </span>
                          </CardContent>
                        </Card>
                      </button>
                    );
                  }

                  return (
                    <article key={item.attemptUrl} aria-labelledby={`test-title-${index}`} className="h-full">
                      <Card className="glass hover-glow transition-all duration-300 hover:scale-105 h-full flex flex-col">
                        <CardHeader>
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle id={`test-title-${index}`} className="text-lg text-red-600">
                              {item.name}
                            </CardTitle>
                            <Badge className={categoryBadgeClass(item.category)}>{item.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1">
                          <div className="text-sm text-muted-foreground space-y-1.5 flex-1 mb-6">
                            {formatDate(item.startTime) && (
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>Starts: {formatDate(item.startTime)}</span>
                              </div>
                            )}
                            {formatDate(item.endTime) && (
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>Ends: {formatDate(item.endTime)}</span>
                              </div>
                            )}
                            <div>Attempts allowed: {item.attemptsAllowed}</div>
                          </div>
                          <Button asChild className={THEME_BUTTON_CLASS}>
                            <a
                              href={item.attemptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Attempt free test: ${item.name}`}
                            >
                              Attempt Free Test
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </article>
                  );
                })}
              </div>

              <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why ACME test series is trusted by serious MCA aspirants</h3>
                <p className="text-muted-foreground leading-8">
                  ACME Academy has built its reputation by helping students prepare with discipline, structure, and real exam exposure. Our free test series is not a random collection of questions; it is a carefully planned learning system that helps students sharpen their preparation for NIMCET, MCA entrance, and related online assessments. Students benefit from previous year pattern awareness, topic-level revision, full-length mock tests, instant solutions, and performance analytics that make every test count.
                </p>
                <p className="text-muted-foreground leading-8 mt-4">
                  The best part is that students can begin with free tests, measure their level, and then move into a more focused preparation routine without feeling overwhelmed. By combining free mock tests, full-length tests, and detailed insights, ACME makes it easier for students to improve rank potential and gain confidence before the final exam.
                </p>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                    Previous
                  </Button>
                  <span className="px-3 py-1 bg-muted rounded text-sm">
                    {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
