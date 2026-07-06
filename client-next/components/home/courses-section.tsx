import { Suspense } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import CoursesData from "@/components/home/courses-data";
import CoursesSkeleton from "@/components/home/courses-skeleton";

// Courses are fetched live from Classplus's public course-preview API
// (lib/classplus-courses.ts) inside the async <CoursesData> Server
// Component, so the heading renders immediately while <Suspense> streams in
// a skeleton until that fetch resolves.
const CoursesSection = () => {
  return (
    <section
      id="courses"
      aria-labelledby="courses-heading"
      className="py-24 bg-gradient-to-b from-blue-50/40 to-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <Reveal initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 id="courses-heading" className="text-4xl font-heading font-bold text-center mb-4 gradient-text">
            Online MCA Entrance Courses for NIMCET, CUET PG &amp; MAH-CET
          </h2>
        </Reveal>

        <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-14">
          Start your MCA entrance preparation with the courses that have helped ACME Academy students secure top
          ranks and admissions into leading NITs and universities. Explore expertly designed live classes,
          recorded courses, and test series for NIMCET, CUET PG MCA, MAH-CET, and other MCA entrance exams. New
          here? Try our{" "}
          <Link href="/acme-free-tests#free-tests" className="text-primary underline underline-offset-2 hover:no-underline">
            free mock tests
          </Link>{" "}
          before enrolling.
        </p>

        <Suspense fallback={<CoursesSkeleton />}>
          <CoursesData />
        </Suspense>
      </div>
    </section>
  );
};

export default CoursesSection;
