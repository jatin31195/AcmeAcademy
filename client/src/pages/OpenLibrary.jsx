import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, Filter, ArrowRight } from "lucide-react";

const OpenLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExam, setSelectedExam] = useState("all");

  const resources = [
    {
      id: 7,
      title: "Complete NIMCET Course",
      category: "Complete Course",
      exam: "NIMCET",
      description:
        "Full NIMCET preparation with Mathematics, English, Computer Fundamentals, and Logical Reasoning - All topics with notes, lectures, assignments, and tests",
      topicsCount: 120,
      type: "Course",
    },
    {
      id: 1,
      title: "Complete Mathematics Guide for NIMCET",
      category: "Books",
      exam: "NIMCET",
      description: "Comprehensive mathematics preparation covering all topics",
      topicsCount: 45,
      type: "PDF",
    },
    {
      id: 2,
      title: "Computer Science Fundamentals",
      category: "Notes",
      exam: "All Exams",
      description: "Basic computer science concepts and programming",
      topicsCount: 38,
      type: "PDF",
    },
    {
      id: 3,
      title: "CUET-PG MCA Preparation Guide",
      category: "Guides",
      exam: "CUET-PG",
      description: "Complete preparation strategy and tips",
      topicsCount: 52,
      type: "PDF",
    },
    {
      id: 4,
      title: "Logical Reasoning Practice Sets",
      category: "Practice Sets",
      exam: "All Exams",
      description: "200+ logical reasoning questions with solutions",
      topicsCount: 28,
      type: "PDF",
    },
    {
      id: 5,
      title: "MAH-CET MCA Mathematics Solutions",
      category: "Solutions",
      exam: "MAH-CET",
      description: "Detailed solutions for mathematics problems",
      topicsCount: 42,
      type: "PDF",
    },
    {
      id: 6,
      title: "English Vocabulary Builder",
      category: "Books",
      exam: "All Exams",
      description: "Essential vocabulary for entrance exams",
      topicsCount: 35,
      type: "PDF",
    },
  ];

  const categories = ["all", "Books", "Notes", "Guides", "Practice Sets", "Solutions"];
  const exams = ["all", "NIMCET", "CUET-PG", "MAH-CET", "JMI MCA", "BIT MCA", "All Exams"];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesExam = selectedExam === "all" || resource.exam === selectedExam;
    return matchesSearch && matchesCategory && matchesExam;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <section className="relative py-30 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Open
            <span className="text-5xl md:text-6xl font-bold block text-gray-800">Library</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Access our comprehensive collection of free study materials, books, notes, and guides for all MCA entrance examinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/70 py-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-[180px] border rounded px-2 py-2"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-[180px] border rounded px-2 py-2"
              >
                {exams.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam === "all" ? "All Exams" : exam}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                to={`/acme-academy-open-library/${resource.id}`}
                state={{ meta: resource }}
              >
                <div className="rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-lg font-semibold text-indigo-600">{resource.title}</h2>
                      <span className="text-xs px-2 py-1 border rounded">{resource.type}</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{resource.category}</span>
                      <span className="text-xs border px-2 py-1 rounded">{resource.exam}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{resource.topicsCount} Topics</span>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                      Start Learning
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OpenLibrary;
