"use client";

import { useState } from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Youtube, BookOpen, Flag, StickyNote, Play, Lock } from "lucide-react";
import AcmePlayer from "@/components/acme-player";

export type Topic = {
  _id: string;
  title: string;
  completed: boolean;
  markedForRevision: boolean;
  notes: string;
  links?: { notes?: string; lecture?: string; assignment?: string };
  locked?: { assignment?: boolean };
  tests?: string[];
};

export type Group = { id: string; title: string; topics: Topic[] };
export type Section = { id: string; title: string; emoji: string; groups: Group[] };

// Ported from client/src/pages/LibraryContent.jsx. All of the interactive
// state here (accordion expansion, checkbox/progress toggles, notes text,
// video modal) is purely ephemeral client-side state in the original too —
// none of it is ever persisted to the backend (topics are always
// re-initialized with completed:false on every fetch), so this is a
// genuinely full-Client body; the Server page.tsx wrapper does the data
// fetching and metadata/JSON-LD generation.
export function LibraryContentBody({
  initialSections,
  courseTitle,
  courseDescription,
}: {
  initialSections: Section[];
  courseTitle: string;
  courseDescription?: string;
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  const totalTopics = sections.reduce((acc, s) => acc + s.groups.reduce((b, g) => b + g.topics.length, 0), 0);
  const completedTopics = sections.reduce(
    (acc, s) => acc + s.groups.reduce((b, g) => b + g.topics.filter((t) => t.completed).length, 0),
    0
  );
  const progress = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const updateTopic = (topicId: string, patch: Partial<Topic>) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        groups: s.groups.map((g) => ({
          ...g,
          topics: g.topics.map((t) => (t._id === topicId ? { ...t, ...patch } : t)),
        })),
      }))
    );
  };

  const toggleTopicExpanded = (id: string) => setExpandedTopic((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <section className="relative py-30 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/acme-academy-open-library">
            <Button variant="ghost" className="mb-6 pointer-cursor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{courseTitle}</h1>
          <p className="text-gray-600 mb-4">{courseDescription}</p>

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

      <section className="py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Accordion type="single" collapsible value={expandedSection} onValueChange={setExpandedSection}>
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="mb-4 border rounded-2xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="AccordionTrigger text-left px-6 py-3 hover:bg-gradient-to-r from-blue-50 to-indigo-50 transition-all cursor-pointer no-underline">
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-2xl no-underline">{section.emoji}</span>
                    <div>
                      <p className="text-lg font-semibold text-gray-800 no-underline">{section.title}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-sm">
                      {section.groups.reduce((a, g) => a + g.topics.filter((t) => t.completed).length, 0)}/
                      {section.groups.reduce((a, g) => a + g.topics.length, 0)} done
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="cursor-pointer px-4 pb-4">
                  <div className="space-y-4">
                    {section.groups.map((group) => {
                      const groupCompleted = group.topics.filter((t) => t.completed).length;

                      return (
                        <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                          <Card
                            className={`no-underline rounded-xl border transition-all duration-300 shadow-sm hover:shadow-lg ${
                              groupCompleted === group.topics.length && group.topics.length > 0 ? "border-green-400" : "border-slate-200"
                            }`}
                          >
                            <CardHeader className="rounded-t-xl px-4 py-2 bg-muted/30"></CardHeader>

                            <CardContent className="space-y-3 mt-2 px-4 py-3">
                              {group.topics.map((topic) => (
                                <motion.div
                                  key={topic._id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border rounded-xl p-3 bg-white/60 hover:bg-slate-50 transition-all"
                                >
                                  <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-start gap-3">
                                      <Checkbox
                                        checked={!!topic.completed}
                                        onCheckedChange={(checked) => updateTopic(topic._id, { completed: Boolean(checked) })}
                                        className="h-5 w-5 mt-1"
                                      />
                                      <div>
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
                                        onClick={() => updateTopic(topic._id, { markedForRevision: !topic.markedForRevision })}
                                        className="flex items-center gap-1"
                                      >
                                        <Flag className="h-4 w-4" /> {topic.markedForRevision ? "Marked" : "Revision"}
                                      </Button>
                                      <Button
                                        variant={expandedTopic === topic._id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleTopicExpanded(topic._id)}
                                        className="flex items-center gap-1"
                                      >
                                        <StickyNote className="h-4 w-4" /> Notes
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="mt-2 overflow-x-auto">
                                    <div className="flex items-center gap-2 border rounded-lg p-2 min-w-[640px] bg-slate-50/50">
                                      <a
                                        href={topic.links?.notes || "#"}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                        onClick={(e) => e.preventDefault()}
                                      >
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        Notes
                                      </a>

                                      <button
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                        onClick={() => {
                                          const lectureUrl = topic?.links?.lecture?.trim();
                                          if (!lectureUrl || lectureUrl === "#") {
                                            alert("Lecture not available");
                                            return;
                                          }
                                          let embedUrl = lectureUrl;
                                          if (lectureUrl.includes("youtu.be")) {
                                            embedUrl = lectureUrl.replace("youtu.be/", "www.youtube.com/embed/");
                                          } else if (lectureUrl.includes("watch?v=")) {
                                            embedUrl = lectureUrl.replace("watch?v=", "embed/");
                                          }
                                          setCurrentVideoUrl(embedUrl);
                                          setShowPlayer(true);
                                        }}
                                      >
                                        <Youtube className="h-4 w-4 text-red-500" />
                                        Lecture
                                      </button>

                                      {topic.locked?.assignment ? (
                                        <a
                                          href="https://acmea.courses.store/"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 px-3 py-1.5 text-muted-foreground text-sm rounded"
                                        >
                                          <Lock className="h-4 w-4" />
                                          Assignment (Locked)
                                        </a>
                                      ) : (
                                        <a
                                          href={topic.links?.assignment || "#"}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                        >
                                          <BookOpen className="h-4 w-4 text-green-600" />
                                          Assignment
                                        </a>
                                      )}

                                      {topic.tests && topic.tests.length > 0 ? (
                                        <div className="flex items-center gap-2 flex-wrap">
                                          {topic.tests.map((testId, index) => (
                                            <Link
                                              key={testId}
                                              href={`/acme-test/${testId}`}
                                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all border border-blue-200 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md"
                                            >
                                              <Play className="h-4 w-4 text-blue-600" />
                                              {topic.tests!.length === 1 ? "Free Test" : `Test ${index + 1}`}
                                            </Link>
                                          ))}
                                        </div>
                                      ) : (
                                        <button
                                          disabled
                                          className="inline-flex items-center gap-1 px-3 py-1.5 text-muted-foreground text-sm rounded cursor-not-allowed"
                                        >
                                          <Lock className="h-4 w-4" />
                                          Free Test (Locked)
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {expandedTopic === topic._id && (
                                    <div className="bg-indigo-50/60 rounded-lg p-3 border mt-2">
                                      <label className="text-sm font-medium flex items-center gap-2">
                                        <StickyNote className="h-4 w-4 text-indigo-500" /> Personal Notes
                                      </label>
                                      <Textarea
                                        value={topic.notes || ""}
                                        onChange={(e) => updateTopic(topic._id, { notes: e.target.value })}
                                        placeholder="Add your thoughts or reminders..."
                                        className="min-h-[90px] mt-2"
                                      />
                                      <p className="text-xs text-muted-foreground mt-2">Notes auto-save instantly 💾</p>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </CardContent>
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
