import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Laptop, Video } from "lucide-react";
import { BASE_URL } from "@/config";

/* ---------------- ICON MAP ---------------- */
const ICON_MAP = {
  BookOpen: BookOpen,
  Laptop: Laptop,
  Clock: Clock,
  Video: Video,
};

/* ---------------- COMPONENT ---------------- */
const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH COURSES ---------------- */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/get-course/home-courses`
        );
        const data = await res.json();
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50/40 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* ---------------- TITLE ---------------- */}
        <motion.h2
          className="text-4xl font-heading font-bold text-center mb-14 gradient-text"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our <span className="text-primary">Courses</span>
        </motion.h2>

        {/* ---------------- LOADING ---------------- */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading courses...
          </p>
        )}

        {/* ---------------- EMPTY ---------------- */}
        {!loading && courses.length === 0 && (
          <p className="text-center text-muted-foreground">
            No courses available
          </p>
        )}

        {/* ---------------- COURSES GRID ---------------- */}
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const Icon = ICON_MAP[course.icon] || BookOpen;

            return (
              <motion.a
                key={course._id}
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="relative glass hover-glow transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200/60 rounded-2xl h-full flex flex-col justify-between">
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-transparent to-purple-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div>
                    <CardHeader className="flex items-center space-x-3 relative z-10">
                      <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      <CardTitle className="text-lg font-semibold leading-snug gradient-text group-hover:text-primary transition-colors duration-300">
                        {course.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <p className="text-muted-foreground mb-3 text-sm leading-relaxed line-clamp-5">
                        {course.description}
                      </p>
                    </CardContent>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 p-4 flex justify-between text-xs font-medium">
                    {course.duration && (
                      <span className="bg-primary/10 px-3 py-1 rounded-full text-primary">
                        ⏳ {course.duration}
                      </span>
                    )}
                    {course.mode && (
                      <span className="bg-primary/10 px-3 py-1 rounded-full text-primary">
                        💻 {course.mode}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
