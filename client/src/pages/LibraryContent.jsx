import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import axios from "axios";
import { BASE_URL } from "../config";
import SEO from "../components/SEO";

export default function LibraryContent() {
  const { id } = useParams(); 

  const [sections, setSections] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedSection, setExpandedSection] = useState("");
  const [expandedGroup, setExpandedGroup] = useState({});
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseMeta, setCourseMeta] = useState({ title: "Loading...", description: "" });

  useEffect(() => {
  const fetchCourseMeta = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses/${id}`);
      setCourseMeta(res.data);
    } catch (err) {
      console.error("Error fetching course meta:", err);
      setCourseMeta({ title: "Course", description: "" });
    }
  };

  fetchCourseMeta();
}, [id]);

  
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);

        // Fetch subjects
        const subjectsRes = await axios.get(`${BASE_URL}/api/subjects/course/${id}`);
        const subjects = subjectsRes.data;

        // Fetch topics for each subject
        const sectionsData = await Promise.all(
          subjects.map(async (subject) => {
            const topicsRes = await axios.get(`${BASE_URL}/api/topics/subject/${subject._id}`);
            return {
              id: subject._id,
              title: subject.title,
              emoji: subject.emoji || "📘",
              groups: [
                {
                  id: `${subject._id}-group`,
                  title: "Topics",
                  topics: topicsRes.data.map((t) => ({
                    ...t,
                    completed: false,
                    markedForRevision: false,
                    notes: "",
                  })),
                },
              ],
            };
          })
        );

        setSections(sectionsData);
      } catch (err) {
        console.error("Error fetching sections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [id]);

  // Compute progress
  const totalTopics = sections.reduce(
    (acc, s) => acc + s.groups.reduce((b, g) => b + g.topics.length, 0),
    0
  );
  const completedTopics = sections.reduce(
    (acc, s) => acc + s.groups.reduce((b, g) => b + g.topics.filter((t) => t.completed).length, 0),
    0
  );
  const progress = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const updateTopic = (topicId, patch) => {
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

  const toggleTopicExpanded = (id) => setExpandedTopic((prev) => (prev === id ? null : id));
  const toggleGroupExpanded = (key) => setExpandedGroup((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) return <div className="p-10 text-center">Loading sections...</div>;

  return (
    <>
    <SEO
  title={`${courseMeta.title} | ACME Academy Open Library`}
  description={
    courseMeta.description ||
    `Access free MCA entrance course materials, video lectures, notes, and assignments for ${courseMeta.title} by ACME Academy.`
  }
  url={`https://www.acmeacademy.in/acme-academy-open-library/${id}`}
  image="https://www.acmeacademy.in/assets/og-course.jpg"
  keywords={`${courseMeta.title}, MCA notes, MCA lectures, NIMCET preparation, CUET PG MCA materials, ACME Academy`}
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseMeta.title,
    "description": courseMeta.description || "Comprehensive MCA entrance preparation course with notes, lectures, and tests.",
    "url": `https://www.acmeacademy.in/acme-academy-open-library/${id}`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "ACME Academy",
      "url": "https://www.acmeacademy.in",
      "logo": "https://www.acmeacademy.in/logo.png"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseWorkload": `${sections.length} subjects`,
      "inLanguage": "en",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "ACME Academy",
        "url": "https://www.acmeacademy.in"
      }
    },
    "hasPart": sections.map((section, i) => ({
      "@type": "CreativeWork",
      "position": i + 1,
      "name": section.title,
      "description": `Topics and learning resources for ${section.title}.`,
      "about": section.emoji ? section.emoji : "Study module",
      "learningResourceType": "Educational material",
      "educationalUse": "Study",
      "isAccessibleForFree": true,
      "provider": {
        "@type": "EducationalOrganization",
        "name": "ACME Academy",
        "url": "https://www.acmeacademy.in"
      },
      "hasPart": section.groups.flatMap((g, idx) =>
        g.topics.map((topic, j) => ({
          "@type": "LearningResource",
          "position": `${i + 1}.${idx + 1}.${j + 1}`,
          "name": topic.title,
          "url": `https://www.acmeacademy.in/acme-academy-open-library/${id}#${topic._id}`,
          "educationalLevel": "Postgraduate Entrance",
          "inLanguage": "en",
          "isAccessibleForFree": true,
          "learningResourceType": "Video / Notes / Assignment",
          "about": section.title,
          "provider": {
            "@type": "EducationalOrganization",
            "name": "ACME Academy",
            "url": "https://www.acmeacademy.in"
          }
        }))
      )
    }))
  }}
/>

    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
    
      <section className="relative py-30 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/acme-academy-open-library">
            <Button variant="ghost" className="mb-6 pointer-cursor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{courseMeta.title}</h1>
          <p className="text-gray-600 mb-4">{courseMeta.description}</p>

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
          {section.groups.map((group, gIdx) => {
            const groupKey = `${section.id}-${group.id}`;
            const groupCompleted = group.topics.filter((t) => t.completed).length;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  className={`no-underline rounded-xl border transition-all duration-300 shadow-sm hover:shadow-lg ${
                    groupCompleted === group.topics.length && group.topics.length > 0
                      ? "border-green-400"
                      : "border-slate-200"
                  }`}
                >
                  <CardHeader className="rounded-t-xl px-4 py-2 bg-muted/30">

                 
                </CardHeader>


                  <CardContent className="space-y-3 mt-2 px-4 py-3">

                      {group.topics.map((topic, idx) => (
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
                                onCheckedChange={(checked) =>
                                  updateTopic(topic._id, { completed: Boolean(checked) })
                                }
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

                          {/* Quick Links */}
                          <div className="mt-2 overflow-x-auto">
                            <div className="flex items-center gap-2 border rounded-lg p-2 min-w-[640px] bg-slate-50/50">
                              <a
                                href={topic.links.notes || "#"}
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
                                  return alert("Lecture not available");
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
                                  href={topic.links.assignment || "#"}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all"
                                >
                                  <BookOpen className="h-4 w-4 text-green-600" />
                                  Assignment
                                </a>
                              )}

                              {/* Free Test Link / Locked */}
{/* Tests Section */}
{topic.tests && topic.tests.length > 0 ? (
  <div className="flex items-center gap-2 flex-wrap">
    {topic.tests.map((testId, index) => (
      <Link
        key={testId}
        to={`/acme-test/${testId}`}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 text-sm transition-all border border-blue-200 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md"
      >
        <Play className="h-4 w-4 text-blue-600" />
        {topic.tests.length === 1 ? "Free Test" : `Test ${index + 1}`}
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
    </>
  );
}
