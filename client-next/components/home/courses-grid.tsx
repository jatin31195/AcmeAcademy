"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ClassplusCourse } from "@/lib/classplus-courses";

// Built from real course data (name + the API's own courseTags), never invented.
function courseImageAlt(course: ClassplusCourse): string {
  const mode = course.courseTags.includes("LIVE CLASS") ? "Live" : "Online";
  return `${mode} MCA entrance course: ${course.name} – ACME Academy`;
}

function CourseImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className="relative w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-primary/50" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-gray-100">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function CoursesGrid({ courses }: { courses: ClassplusCourse[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {courses.map((course, index) => {
        const resourceParts = [
          course.resources.tests > 0 ? `${course.resources.tests} Tests` : null,
          course.resources.files > 0 ? `${course.resources.files} Notes` : null,
          course.resources.videos > 0 ? `${course.resources.videos} Videos` : null,
        ].filter((part): part is string => Boolean(part));

        const metaParts = [
          course.likes > 0 ? `❤ ${course.likes}` : null,
          course.subscriberCount > 0 ? `${course.subscriberCount} enrolled` : null,
        ].filter((part): part is string => Boolean(part));

        return (
          <motion.article
            key={course.id}
            aria-labelledby={`course-title-${course.id}`}
            className="group h-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <Card className="relative glass hover-glow transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200/60 rounded-2xl h-full flex flex-col overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-transparent to-purple-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

              <CourseImage src={course.imageUrl} alt={courseImageAlt(course)} />

              <div className="flex flex-col flex-1 relative z-10">
                <CardHeader className="p-4">
                  <CardTitle
                    id={`course-title-${course.id}`}
                    className="text-sm font-semibold leading-snug gradient-text group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[2.25rem]"
                  >
                    {course.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 p-4 pt-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-lg font-bold text-primary">
                      ₹{course.finalPrice.toLocaleString("en-IN")}
                    </span>
                    {course.finalPrice < course.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{course.price.toLocaleString("en-IN")}
                      </span>
                    )}
                    {course.coupon && (
                      <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Extra ₹{course.coupon.couponDiscountAmount.toLocaleString("en-IN")} Coupon
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-muted-foreground bg-gray-50 border border-gray-100 rounded-md px-2 py-1.5 mb-2 space-y-0.5">
                    <div className="flex justify-between">
                      <span>+ Internet Handling Charges</span>
                      <span>Applicable</span>
                    </div>
                    <div className="flex justify-between">
                      <span>+ Platform Fee</span>
                      <span>Applicable</span>
                    </div>
                    <p className="pt-0.5 text-primary font-medium leading-snug">
                      Avoid these charges — call our centre or raise a query, we&apos;ll call you back.
                    </p>
                  </div>

                  {(course.courseTags.length > 0 || course.isCertificateEnabled) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {course.courseTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[9px] font-medium px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {course.isCertificateEnabled && (
                        <Badge variant="secondary" className="text-[9px] font-medium px-1.5 py-0">
                          Certification Available
                        </Badge>
                      )}
                    </div>
                  )}

                  {resourceParts.length > 0 && (
                    <p className="text-[10px] text-muted-foreground mb-2">{resourceParts.join(" · ")}</p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-muted-foreground truncate">{metaParts.join(" • ")}</span>
                    <Button asChild size="sm" className="shrink-0">
                      <a
                        href={course.enrollUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Enroll in ${course.name}`}
                      >
                        Enroll Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.article>
        );
      })}
    </div>
  );
}
