import { fetchClassplusCourses } from "@/lib/classplus-courses";
import CoursesGrid from "@/components/home/courses-grid";

export default async function CoursesData() {
  const { courses, error } = await fetchClassplusCourses();

  if (error) {
    return (
      <p className="text-center text-muted-foreground">
        Courses are temporarily unavailable. Please try again shortly.
      </p>
    );
  }

  if (courses.length === 0) {
    return <p className="text-center text-muted-foreground">No courses available</p>;
  }

  const coursesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Online MCA Entrance Courses — NIMCET, CUET PG & MAH-CET",
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.name,
        ...(course.imageUrl && { image: course.imageUrl }),
        provider: {
          "@type": "EducationalOrganization",
          name: "ACME Academy",
          url: "https://www.acmeacademy.in",
        },
        offers: {
          "@type": "Offer",
          price: course.finalPrice,
          priceCurrency: "INR",
          url: course.enrollUrl,
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }} />
      <CoursesGrid courses={courses} />
    </>
  );
}
