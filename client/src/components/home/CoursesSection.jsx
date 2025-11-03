import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Laptop } from "lucide-react";

const CoursesSection = () => {
  const courses = [
    {
      title: "All India NIMCET TEST SERIES 2026",
      duration: "1 Year",
      mode: "Offline / Online",
      description:
        "India's most trusted and affordable NIMCET Test Series with 400+ live tests, 600+ topic-wise and mock tests, PYQs, detailed analysis, and expert-guided test discussions.",
      icon: BookOpen,
      link: "https://acmea.courses.store/477007",
    },
    {
      title:
        "ACME PREMIUM TEST SERIES for NIMCET, CUET & All India MCA Exams 2026",
      duration: "1 Year",
      mode: "Hybrid",
      description:
        "Comprehensive test series for NIMCET, CUET, MAH-CET, and VIT — live tests, deep analytics, and structured preparation. Trusted by toppers across India.",
      icon: Laptop,
      link: "https://acmea.courses.store/477548",
    },
    {
      title:
        "Premium Live + Recorded Course | NIMCET | CUET | MAH-CET | JAMIA | VIT | AIMCA 2026",
      duration: "1 Year",
      mode: "Hybrid",
      description:
        "Fast-track hybrid course with live + recorded sessions, quick conceptual clarity, and complete exam coverage for all top MCA entrances.",
      icon: Clock,
      link: "https://acmea.courses.store/428265",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50/40 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
      
        <motion.h2
          className="text-4xl font-heading font-bold text-center mb-14 gradient-text"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our <span className="text-primary">Courses</span>
        </motion.h2>

     
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.a
              key={index}
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
               
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-transparent to-purple-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div>
                  <CardHeader className="flex items-center space-x-3 relative z-10">
                    <course.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
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

           
                <div className="relative z-10 p-4 flex justify-between text-xs font-medium">
                  <span className="bg-primary/10 px-3 py-1 rounded-full text-primary">
                    ⏳ {course.duration}
                  </span>
                  <span className="bg-primary/10 px-3 py-1 rounded-full text-primary">
                    💻 {course.mode}
                  </span>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
