import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BookOpen, ArrowRight } from "lucide-react";
import { BASE_URL } from "@/lib/config";

// Ported from client/src/pages/FreeCourses.jsx. That original declared
// searchTerm/selectedCategory/selectedExam state and filtering logic, but the
// actual "Filters" JSX section was empty — no <input>/<select> anywhere ever
// changed those values, so the filter was 100% dead code (always evaluates to
// "show everything", since defaults are "" / "all" / "all"). This Server
// Component reproduces the one behavior that was ever actually reachable —
// an unfiltered course grid — fetched server-side instead of client-side, so
// both the grid and its JSON-LD are present in the initial HTML (an SEO
// improvement over the original's client-fetch-then-render).
type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  exam?: string;
  type?: string;
};

async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/courses`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Free MCA Self-Study Courses | NIMCET & CUET-PG Preparation | ACME Academy",
  description:
    "Access 100% free MCA self-study courses from ACME Academy — including notes, guides, and video lectures for NIMCET, CUET-PG, and MAH-CET. Learn at your own pace!",
  keywords: "Free MCA courses, MCA online study, NIMCET free course, CUET PG MCA course, ACME Academy, MCA entrance coaching",
  alternates: { canonical: "/acme-free-courses" },
  openGraph: {
    type: "website",
    title: "Free MCA Self-Study Courses | NIMCET & CUET-PG Preparation | ACME Academy",
    description:
      "Access 100% free MCA self-study courses from ACME Academy — including notes, guides, and video lectures for NIMCET, CUET-PG, and MAH-CET. Learn at your own pace!",
    url: "/acme-free-courses",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free MCA Self-Study Courses | NIMCET & CUET-PG Preparation | ACME Academy",
    description:
      "Access 100% free MCA self-study courses from ACME Academy — including notes, guides, and video lectures for NIMCET, CUET-PG, and MAH-CET. Learn at your own pace!",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

export default async function FreeCoursesPage() {
  const courses = await fetchCourses();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ACME Academy Free MCA Courses",
    description:
      "A free library of MCA entrance self-study courses offered by ACME Academy — including Mathematics, Reasoning, Computer Concepts, and English modules.",
    url: "https://www.acmeacademy.in/acme-free-courses",
    publisher: {
      "@type": "EducationalOrganization",
      name: "ACME Academy",
      url: "https://www.acmeacademy.in",
      logo: "https://www.acmeacademy.in/logo.png",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Free MCA Self Study Courses",
      itemListOrder: "ItemListOrderAscending",
      numberOfItems: courses.length,
      itemListElement: courses.slice(0, 12).map((course, index) => ({
        "@type": "Course",
        position: index + 1,
        name: course.title,
        description: course.description || "MCA self-paced course with notes and video lectures.",
        provider: {
          "@type": "EducationalOrganization",
          name: "ACME Academy",
          url: "https://www.acmeacademy.in",
        },
        educationalLevel: "Postgraduate Entrance",
        courseMode: "Online",
        isAccessibleForFree: true,
        url: `https://www.acmeacademy.in/acme-academy-open-library/${course._id}`,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Self-paced",
          inLanguage: "en",
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          provider: {
            "@type": "EducationalOrganization",
            name: "ACME Academy",
            url: "https://www.acmeacademy.in",
          },
        },
      })),
    },
  };

  return (
    <>
      <Script id="ld-free-courses" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        <section className="relative py-30 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-5xl md:text-6xl font-bold block text-gray-100">Self Study Courses</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
              Access all MCA self-study courses curated for you. Learn at your own pace with complete resources, notes, and
              guides.
            </p>
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
              <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
                <path
                  d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </section>

        <section className="py-16 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            {courses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Link key={course._id} href={`/acme-academy-open-library/${course._id}`}>
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
    </>
  );
}
