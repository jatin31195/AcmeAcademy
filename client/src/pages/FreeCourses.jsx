import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BookOpen, Search, Filter, ArrowRight } from "lucide-react";
import { BASE_URL } from "../config";
const FreeCourses = () => {
  const [courses, setCourses] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExam, setSelectedExam] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["all", "Books", "Notes", "Guides", "Practice Sets", "Solutions", "Complete Course", "Free Course"];
  const exams = ["all", "NIMCET", "CUET-PG", "MAH-CET", "JMI MCA", "BIT MCA", "All Exams"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/courses`);
        setCourses(res.data);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredResources = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesExam = selectedExam === "all" || course.exam === selectedExam;
    return matchesSearch && matchesCategory && matchesExam;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <section className="relative py-30 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
           
            <span className="text-5xl md:text-6xl font-bold block text-gray-100">Self Study Courses</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
            Access all MCA self-study courses curated for you. Learn at your own pace with complete resources, notes, and guides.
          </p>
              <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
              fill="white"
            />
          </svg>
        </div>
        </div>
      </section>

      {/* Filters */}
    

      {/* Resources Grid */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-medium">{error}</div>
          ) : filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((course) => (
              <Link
  key={course._id}
  to={`/acme-academy-open-library/${course._id}`}
  state={{ meta: course }}
>
  <div className="rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6 h-full flex flex-col justify-between cursor-pointer">
    <div>
      <div className="flex items-start justify-between mb-2 cursor-pointer">
        <h2 className="text-lg font-semibold text-indigo-600">{course.title}</h2>
        <span className="text-xs px-2 py-1 border rounded">{course.type}</span>
      </div>
      <div className="flex gap-2 mb-3">
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{course.category}</span>
        <span className="text-xs border px-2 py-1 rounded">{course.exam}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
    </div>
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-indigo-600 font-medium">
        Start Learning
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </div>
</Link>

              ))}
            </div>
          ) : (
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

export default FreeCourses;
