"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import MainContent, { type SubjectLike, type TopicLike } from "./main-content";
import { BASE_URL } from "@/lib/config";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { QuestionItem } from "./question-detail";

const QUESTIONS_PER_PAGE = 5;

type PracticeSet = { _id: string; title: string };
type PracticeTopic = { _id: string; title: string };

// Ported from client/src/pages/PracticeSets.jsx — the same component handled
// all 4 nested route depths in the original via react-router's useParams, so
// it's ported as one Client Component reused across all 4 Next.js route
// segments (each Server page.tsx passes its own params as props). The
// cascading fetch/URL-sync logic is preserved exactly; only the router hooks
// are adapted (useParams->props, useNavigate->useRouter().push,
// useSearchParams->next/navigation's read hook + manual URL construction for
// writes, since Next has no direct setSearchParams setter).
export function PracticeSetsClient({
  setId,
  categoryId,
  topicName,
}: {
  setId?: string;
  categoryId?: string;
  topicName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tagFromUrl = searchParams.get("tag");
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  const [practiceSets, setPracticeSets] = useState<PracticeSet[]>([]);
  const [practiceTopics, setPracticeTopics] = useState<PracticeTopic[]>([]);
  // `topics` itself is never read elsewhere, only `setTopics` — matches the
  // original PracticeSets.jsx, which also never rendered this state directly
  // (rendering instead reads `expandedSubjects[...]`, set alongside it below).
  const [, setTopics] = useState<string[]>([]);

  const [selectedPracticeSet, setSelectedPracticeSet] = useState<PracticeSet | null>(null);
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState<PracticeTopic | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ name: string } | null>(null);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, string[]>>({});

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showSolution, setShowSolution] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [showTopics, setShowTopics] = useState(true);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/practice-set`).then((res) => {
      setPracticeSets(res.data?.data || []);
    });
  }, []);

  const fetchPracticeTopics = async (setId: string) => {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/api/practice-topic/${setId}`);
    setPracticeTopics(res.data?.data || []);
    setLoading(false);
  };

  const fetchTopics = async (practiceTopicId: string) => {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/api/questions/practice-topic/${practiceTopicId}/topics`);
    const data = res.data?.data || [];
    setTopics(data);
    setExpandedSubjects((p) => ({ ...p, [practiceTopicId]: data }));
    setLoading(false);
  };

  const fetchQuestions = async (practiceTopicId: string, topic: string) => {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/api/questions/practice-topic/${practiceTopicId}/topics/${encodeURIComponent(topic)}`);
    setQuestions(res.data?.data || []);
    setSelectedTopic({ name: topic });
    setSelectedOptions({});
    setCurrentPage(pageFromUrl);
    setLoading(false);
  };

  useEffect(() => {
    if (!practiceSets.length || !setId) return;
    const set = practiceSets.find((s) => s._id === setId);
    if (!set) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL param -> state hydration, ported as-is
    setSelectedPracticeSet(set);
    fetchPracticeTopics(set._id);
  }, [practiceSets, setId]);

  useEffect(() => {
    if (!practiceTopics.length || !categoryId) return;
    const topic = practiceTopics.find((t) => t._id === categoryId);
    if (!topic) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL param -> state hydration, ported as-is
    setSelectedPracticeTopic(topic);
    fetchTopics(topic._id);
  }, [practiceTopics, categoryId]);

  useEffect(() => {
    if (!selectedPracticeTopic || !topicName) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchQuestions sets state internally, ported as-is
    fetchQuestions(selectedPracticeTopic._id, topicName);
    setShowTopics(false);
    // fetchQuestions intentionally omitted: it's redefined every render (not
    // memoized, same as the original PracticeSets.jsx), so including it would
    // re-run this effect on every render instead of only when the URL params
    // change — the original had this same omission, just without ESLint
    // enforcing it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPracticeTopic, topicName]);

  const handleOptionClick = (
    id: string,
    option: string,
    correctAnswer?: string,
    solutionText?: string,
    solutionImage?: string,
    solutionVideo?: string
  ) => {
    setSelectedOptions((p) => ({ ...p, [id]: option }));
    setShowSolution((p) => ({
      ...p,
      [id]: { show: true, correctAnswer, solutionText, solutionImage, solutionVideo },
    }));
  };

  const getOptionStyle = (id: string, correctAnswer: string | undefined, option: string) => {
    const selected = selectedOptions[id];
    if (!selected) return "";
    if (option === correctAnswer) return "border-green-500 bg-green-100";
    if (option === selected && option !== correctAnswer) return "border-red-500 bg-red-100";
    return "";
  };

  const expandedQuestions = useMemo(() => {
    const list: QuestionItem[] = [];
    questions.forEach((q) => {
      list.push({ ...q, isSub: false });
      (q as QuestionItem & { subQuestions?: QuestionItem[] }).subQuestions?.forEach((sub) => list.push({ ...sub, isSub: true, parentId: q._id }));
    });
    return list;
  }, [questions]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(currentPage));
    if (tagFromUrl) params.set("tag", tagFromUrl);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <>
      <section className="relative py-28 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="absolute left-8 top-8 sm:left-56 sm:top-18">
            <Link href="/acme-academy-open-library">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Library
              </Button>
            </Link>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 text-gray-100">Practice Sets</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">Choose your Practice Set, Category, and Topic to begin practicing.</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 px-2 sm:px-0 w-full max-w-4xl mx-auto">
            <div className="relative w-full sm:w-80 z-20">
              <select
                value={selectedPracticeSet?._id || ""}
                onChange={(e) => {
                  const set = practiceSets.find((s) => s._id === e.target.value);
                  if (!set) return;

                  setSelectedPracticeSet(set);
                  setSelectedPracticeTopic(null);
                  setSelectedTopic(null);
                  setTopics([]);
                  setQuestions([]);
                  setShowTopics(true);

                  fetchPracticeTopics(set._id);

                  router.push(`/acme-practice-sets/${set._id}`);
                }}
                className="w-full appearance-none bg-white text-gray-800 px-5 py-3 rounded-lg shadow-md
                           focus:ring-4 focus:ring-blue-300 font-medium cursor-pointer
                           border border-gray-200 sm:text-base text-sm transition-all duration-200"
              >
                <option value="">Select Practice Set</option>
                {practiceSets.map((set) => (
                  <option key={set._id} value={set._id}>
                    {set.title}
                  </option>
                ))}
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="relative w-full sm:w-80 z-10">
              <select
                value={selectedPracticeTopic?._id || ""}
                onChange={(e) => {
                  const topic = practiceTopics.find((t) => t._id === e.target.value);
                  if (!topic || !selectedPracticeSet) return;

                  setSelectedPracticeTopic(topic);
                  setSelectedTopic(null);
                  setQuestions([]);
                  setShowTopics(true);

                  fetchTopics(topic._id);

                  router.push(`/acme-practice-sets/${selectedPracticeSet._id}/${topic._id}`);
                }}
                disabled={!selectedPracticeSet}
                className="w-full appearance-none bg-white text-gray-800 px-5 py-3 rounded-lg shadow-md
                           focus:ring-4 focus:ring-indigo-300 font-medium cursor-pointer
                           border border-gray-200 sm:text-base text-sm
                           transition-all duration-200 disabled:opacity-50"
              >
                <option value="">Select Practice Category</option>
                {practiceTopics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title}
                  </option>
                ))}
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
              <path
                d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94
                661.18 4.8 578.56-5.45 497.2 1.79
                423.15 8.3 349.38 28.74 278.07 51.84
                183.09 83.72 90.6 121.65 0 120v20h1200v-20
                c-80.3-1.6-160.39-26.5-214.34-47.17z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPracticeTopic?._id || "topics"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto px-6 py-10 bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl -mt-15 relative z-10"
        >
          <div className="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row">
            <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
              {selectedPracticeTopic ? `${selectedPracticeTopic.title} Topics` : "Topics"}
            </h2>

            <button
              onClick={() => setShowTopics((prev) => !prev)}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm font-medium"
            >
              {showTopics ? "Hide Topics" : "Show Topics"}
            </button>
          </div>

          {showTopics && selectedPracticeTopic && expandedSubjects[selectedPracticeTopic._id] && (
            <div className="flex flex-wrap justify-center gap-3">
              {expandedSubjects[selectedPracticeTopic._id].map((topic) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    fetchQuestions(selectedPracticeTopic._id, topic);
                    setShowTopics(false);
                    setCurrentPage(1);

                    router.push(`/acme-practice-sets/${selectedPracticeSet!._id}/${selectedPracticeTopic._id}/${encodeURIComponent(topic)}?page=1`);
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedTopic?.name === topic
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md border-transparent"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex-1 px-4 sm:px-8 py-10 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        <MainContent
          loading={loading}
          expandedQuestions={expandedQuestions}
          selectedSubject={selectedPracticeSet as SubjectLike}
          selectedTopic={selectedTopic as TopicLike}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleOptionClick={handleOptionClick}
          getOptionStyle={getOptionStyle}
          showSolution={showSolution}
          QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
        />
      </div>
    </>
  );
}
