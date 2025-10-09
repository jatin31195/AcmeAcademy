import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Youtube, BookOpen, Flag, StickyNote, Play, Lock } from "lucide-react";
import AcmePlayer from "./AcmePlayer";


const metaById = {
  7: {
    id: 7,
    title: "Complete NIMCET Course",
    category: "Complete Course",
    exam: "NIMCET",
    description:
      "Full NIMCET preparation with Mathematics, English, Computer Fundamentals, and Logical Reasoning - All topics with notes, lectures, assignments, and tests",
    topicsCount: 120,
    type: "Course",
  },
  1: {
    id: 1,
    title: "Complete Mathematics Guide for NIMCET",
    category: "Books",
    exam: "NIMCET",
    description: "Comprehensive mathematics preparation covering all topics",
    topicsCount: 45,
    type: "PDF",
  },
  2: {
    id: 2,
    title: "Computer Science Fundamentals",
    category: "Notes",
    exam: "All Exams",
    description: "Basic computer science concepts and programming",
    topicsCount: 38,
    type: "PDF",
  },
  3: {
    id: 3,
    title: "CUET-PG MCA Preparation Guide",
    category: "Guides",
    exam: "CUET-PG",
    description: "Complete preparation strategy and tips",
    topicsCount: 52,
    type: "PDF",
  },
  4: {
    id: 4,
    title: "Logical Reasoning Practice Sets",
    category: "Practice Sets",
    exam: "All Exams",
    description: "200+ logical reasoning questions with solutions",
    topicsCount: 28,
    type: "PDF",
  },
  5: {
    id: 5,
    title: "MAH-CET MCA Mathematics Solutions",
    category: "Solutions",
    exam: "MAH-CET",
    description: "Detailed solutions for mathematics problems",
    topicsCount: 42,
    type: "PDF",
  },
  6: {
    id: 6,
    title: "English Vocabulary Builder",
    category: "Books",
    exam: "All Exams",
    description: "Essential vocabulary for entrance exams",
    topicsCount: 35,
    type: "PDF",
  },
};


const defaultSectionsSeed = [
  {
    id: "math",
    title: "Mathematics",
    emoji: "📘",
    groups: [
      {
        id: "math-permutation",
        title: "Permutation",
        topics: [
          {
            id: "math-perm-1",
            title: "Permutation 1",
            locked: { assignment: false },
            links: {
              notes: "#",
              lecture: "https://youtu.be/pb6IlgfyHcQ?si=yKFzVyvDmxkM4rIZ",
              assignment: "#",
              test: "/acme-test/math-perm-1",
            },
          },
          {
            id: "math-perm-2",
            title: "Permutation 2",
            locked: { assignment: true,
                test: true 
             },
          
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/math-perm-2",
            },
          },
        ],
      },
      {
        id: "math-combination",
        title: "Combination",
        topics: [
          {
            id: "math-comb-1",
            title: "Combination 1",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/math-comb-1",
            },
          },
          {
            id: "math-comb-2",
            title: "Combination 2",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/math-comb-2",
            },
          },
        ],
      },
    ],
  },
  {
    id: "reasoning",
    title: "Logical Reasoning",
    emoji: "🧠",
    groups: [
      {
        id: "lr-core",
        title: "Core Reasoning",
        topics: [
          {
            id: "lr-series",
            title: "Series & Patterns",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/lr-series",
            },
          },
          {
            id: "lr-deduction",
            title: "Logical Deduction",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/lr-deduction",
            },
          },
        ],
      },
    ],
  },
  {
    id: "computer",
    title: "Computer Fundamentals",
    emoji: "💻",
    groups: [
      {
        id: "cs-core",
        title: "Core CS",
        topics: [
          {
            id: "cs-c-basics",
            title: "Basics of C Programming",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/cs-c-basics",
            },
          },
          {
            id: "cs-ds",
            title: "Data Structures",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/cs-ds",
            },
          },
        ],
      },
    ],
  },
  {
    id: "english",
    title: "English",
    emoji: "✍",
    groups: [
      {
        id: "eng-core",
        title: "Core English",
        topics: [
          {
            id: "eng-vocab",
            title: "Vocabulary Building",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/eng-vocab",
            },
          },
          {
            id: "eng-grammar",
            title: "Grammar Fundamentals",
            locked: { assignment: true },
            links: {
              notes: "#",
              lecture: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignment: "#",
              test: "/test/eng-grammar",
            },
          },
        ],
      },
    ],
  },
];

const courseSectionsMap = {
  7: ["math", "reasoning", "computer", "english"], // Complete NIMCET
  1: ["math"], // Mathematics PDF
  2: ["computer"], // CS Notes
  3: ["english"], // CUET-PG MCA Guide
  4: ["reasoning"], // Logical reasoning
  5: ["math"], // MAH-CET Math Solutions
  6: ["english"], // English Vocabulary
};

export default function LibraryContent() {
  const { id } = useParams();
  const { state } = useLocation();
  const numericId = Number(id);
  const meta =
    state?.meta ??
    metaById[numericId] ?? {
      id: numericId,
      title: "Resource",
      category: "General",
      exam: "All Exams",
      description: "Resource content",
      topicsCount: 0,
      type: "General",
    };

  const [sections, setSections] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedSection, setExpandedSection] = useState("");
  const [expandedGroup, setExpandedGroup] = useState({});
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  const storageKey = `library-grouped-progress-v1-${numericId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSections(JSON.parse(saved));
      return;
    }
    
    const allowedSectionIds = courseSectionsMap[numericId] || [];
    const hydrated = defaultSectionsSeed
      .filter((sec) => allowedSectionIds.includes(sec.id))
      .map((sec) => ({
        ...sec,
        groups: sec.groups.map((g) => ({
          ...g,
          topics: g.topics.map((t) => ({
            ...t,
            completed: false,
            markedForRevision: false,
            notes: "",
          })),
        })),
      }));
    setSections(hydrated);
  }, [numericId, storageKey]);

  useEffect(() => {
    if (sections.length) {
      localStorage.setItem(storageKey, JSON.stringify(sections));
    }
  }, [sections, storageKey]);
  useEffect(() => {
    // cleanup when user leaves the page
    return () => {
      localStorage.removeItem("selectedCourseId");
      sessionStorage.removeItem("selectedCourseId");
    };
  }, []);
  const totalTopics = useMemo(
    () => sections.reduce((a, s) => a + s.groups.reduce((b, g) => b + g.topics.length, 0), 0),
    [sections]
  );

  const completedTopics = useMemo(
    () => sections.reduce((a, s) => a + s.groups.reduce((b, g) => b + g.topics.filter((t) => t.completed).length, 0), 0),
    [sections]
  );

  const progress = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const updateTopic = (id, patch) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        groups: s.groups.map((g) => ({
          ...g,
          topics: g.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      }))
    );
  };

  const toggleTopicExpanded = (id) => setExpandedTopic((prev) => (prev === id ? null : id));
  const toggleGroupExpanded = (key) => setExpandedGroup((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <section className="relative py-30 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/acme-academy-open-library">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{meta.category}</Badge>
            <Badge variant="outline">{meta.exam}</Badge>
            <Badge variant="outline">{meta.type}</Badge>
            <Badge variant="outline">{meta.topicsCount} topics</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{meta.title}</h1>
          <p className="text-gray-600 mb-4">
            Mathematics groups combine related topics into single cards, like Permutation 1 & 2 and Combination 1 & 2, with the same quick actions.
          </p>

          <div className="bg-muted rounded-lg p-4 max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedTopics} of {totalTopics} topics completed
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Your Learning Journey 🚀
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Track progress, mark revisions, and access Acme Academy resources — all in one elegant place.
          </p>

          <Accordion type="single" collapsible value={expandedSection} onValueChange={setExpandedSection}>
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="mb-4 border rounded-2xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="text-left px-6 py-3 hover:bg-gradient-to-r from-blue-50 to-indigo-50 transition-all no-underline hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-2xl">{section.emoji}</span>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{section.title}</p>
                      <p className="text-sm text-muted-foreground">{section.groups.length} topic groups</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-sm">
                      {section.groups.reduce((a, g) => a + g.topics.filter((t) => t.completed).length, 0)}/
                      {section.groups.reduce((a, g) => a + g.topics.length, 0)} done
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="cursor-pointer px-4 pb-4">
                  <div className="space-y-4">
                    {section.groups.map((group, gIdx) => {
                      const groupKey = `${section.id}-${group.id}`;
                      const groupCompleted = group.topics.filter((t) => t.completed).length;

                      return (
                        <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                          <Card
                            className={`rounded-xl border transition-all duration-300 shadow-sm hover:shadow-lg ${
                              groupCompleted === group.topics.length && group.topics.length > 0
                                ? "border-green-400"
                                : "border-slate-200"
                            }`}
                          >
                            <CardHeader className="rounded-t-xl px-4 py-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <CardTitle className="gradient-text font-medium text-base leading-tight">
                                    <span className="gradient-hero mr-1">{gIdx + 1}.</span> {group.title}
                                  </CardTitle>
                                  <Badge variant="outline" className="bg-white/70 backdrop-blur">
                                    {groupCompleted}/{group.topics.length} done
                                  </Badge>
                                </div>
                                <Button
                                  variant={expandedGroup[groupKey] ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleGroupExpanded(groupKey)}
                                >
                                  {expandedGroup[groupKey] ? "Hide Topics" : "Show Topics"}
                                </Button>
                              </div>
                            </CardHeader>

                            {expandedGroup[groupKey] && (
                              <CardContent className="space-y-3 mt-2 px-4 py-3">
                                {group.topics.map((topic, idx) => (
                                  <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border rounded-xl p-3 bg-white/60 hover:bg-slate-50 transition-all"
                                  >
                                    <div className="flex justify-between items-start gap-3">
                                      <div className="flex items-start gap-3">
                                        <Checkbox
                                          checked={!!topic.completed}
                                          onCheckedChange={(checked) => updateTopic(topic.id, { completed: Boolean(checked) })}
                                          className="h-5 w-5 mt-1"
                                        />
                                        <div>
                                          <div className="text-xs text-muted-foreground">Topic {idx + 1}</div>
                                          <div
                                            className={`text-base ${
                                              topic.completed ? "line-through text-muted-foreground" : "font-medium text-gray-800"
                                            }`}
                                          >
                                            {topic.title}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex gap-2 flex-wrap">
                                        <Button
                                          variant={topic.markedForRevision ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => updateTopic(topic.id, { markedForRevision: !topic.markedForRevision })}
                                          className="flex items-center gap-1"
                                        >
                                          <Flag className="h-4 w-4" /> {topic.markedForRevision ? "Marked" : "Revision"}
                                        </Button>
                                        <Button
                                          variant={expandedTopic === topic.id ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => toggleTopicExpanded(topic.id)}
                                          className="flex items-center gap-1"
                                        >
                                          <StickyNote className="h-4 w-4" /> Notes
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Quick Links */}
                                    <div className="mt-2 overflow-x-auto">
                                      <div className="flex items-center gap-2 border rounded-lg p-2 min-w-[640px] bg-slate-50/50">
                                        {/* Notes - disabled */}
                                        <a
                                          href={topic.links.notes}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                          onClick={(e) => e.preventDefault()}
                                        >
                                          <FileText className="h-4 w-4 text-indigo-500" />
                                          Notes
                                        </a>

                                        {/* Lecture */}
                                        <button
                                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                          onClick={() => {
                                            if (!topic.links.lecture) {
                                              alert("Lecture not available");
                                              return;
                                            }
                                            setCurrentVideoUrl(topic.links.lecture);
                                            setShowPlayer(true);
                                          }}
                                        >
                                          <Youtube className="h-4 w-4 text-red-500" />
                                          Lecture
                                        </button>

                                       
                                        {/* Assignment */}
                                        {topic.locked?.assignment ? (
                                        <a
                                            href="https://acmea.courses.store/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Purchase Course to Unlock"
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-muted-foreground text-sm rounded"
                                        >
                                            <Lock className="h-4 w-4" />
                                            Assignment (Locked)
                                            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      Purchase Course
    </span>
                                        </a>
                                        ) : (
                                        <a
                                            href={topic.links.assignment}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                        >
                                            <BookOpen className="h-4 w-4 text-green-600" />
                                            Assignment
                                        </a>
                                        )}


                                       
                                    {/* Free Test */}
                                    {topic.locked?.test ? (
                                    <a
                                        href="https://acmea.courses.store/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Purchase Course to Unlock"

                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-muted-foreground text-sm rounded"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Free Test (Locked)
                                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      Purchase Course
    </span>
                                    </a>
                                    ) : (
                                    <Link
                                        to={topic.links.test}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                    >
                                        <Play className="h-4 w-4 text-blue-600" />
                                        Free Test
                                    </Link>
                                    )}

                                      </div>
                                    </div>

                                    {expandedTopic === topic.id && (
                                      <div className="bg-indigo-50/60 rounded-lg p-3 border mt-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                          <StickyNote className="h-4 w-4 text-indigo-500" /> Personal Notes
                                        </label>
                                        <Textarea
                                          value={topic.notes || ""}
                                          onChange={(e) => updateTopic(topic.id, { notes: e.target.value })}
                                          placeholder="Add your thoughts or reminders..."
                                          className="min-h-[90px] mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">Notes auto-save instantly 💾</p>
                                      </div>
                                    )}
                                  </motion.div>
                                ))}
                              </CardContent>
                            )}
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {showPlayer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-xl relative">
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-3 right-3 text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 z-50"
            >
              Close
            </button>
            <AcmePlayer videoUrl={currentVideoUrl} />
          </div>
        </div>
      )}
    </div>
  );
}
