import { CLASSPLUS_COURSE_PREVIEW_URL, CLASSPLUS_STORE_ORIGIN } from "@/lib/config";

export type ClassplusCourseResources = {
  files: number;
  videos: number;
  tests: number;
};

export type ClassplusCoupon = {
  code: string;
  name: string;
  couponDiscountAmount: number;
};

export type ClassplusCourse = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  finalPrice: number;
  discountPercentage: number;
  isFreeCourse: boolean;
  resources: ClassplusCourseResources;
  likes: number;
  subscriberCount: number;
  courseTags: string[];
  isCertificateEnabled: boolean;
  coupon: ClassplusCoupon | null;
  enrollUrl: string;
};

export type ClassplusCoursesResult = {
  courses: ClassplusCourse[];
  error: boolean;
};

type RawCourseTag = { text?: unknown };

type RawCoupon = {
  code?: unknown;
  name?: unknown;
  couponDiscountAmount?: unknown;
};

type RawCourse = {
  id?: unknown;
  name?: unknown;
  imageUrl?: unknown;
  price?: unknown;
  finalPrice?: unknown;
  discountPercentage?: unknown;
  isFreeCourse?: unknown;
  resources?: { files?: unknown; videos?: unknown; tests?: unknown } | null;
  likes?: { value?: unknown } | null;
  totalSubscriberCount?: unknown;
  courseTags?: RawCourseTag[] | null;
  isCertificateEnabled?: unknown;
  couponData?: RawCoupon | null;
  shareableLink?: unknown;
  singlePaymentLink?: unknown;
};

function mapCourse(raw: RawCourse): ClassplusCourse | null {
  if (typeof raw.id !== "number" || typeof raw.name !== "string" || !raw.name) return null;

  const enrollUrl =
    typeof raw.shareableLink === "string" && raw.shareableLink
      ? raw.shareableLink
      : typeof raw.singlePaymentLink === "string" && raw.singlePaymentLink
        ? raw.singlePaymentLink
        : "";
  if (!enrollUrl) return null;

  const price = typeof raw.price === "number" ? raw.price : 0;
  const resources = raw.resources ?? {};
  const coupon =
    raw.couponData && typeof raw.couponData.couponDiscountAmount === "number"
      ? {
          code: typeof raw.couponData.code === "string" ? raw.couponData.code : "",
          name: typeof raw.couponData.name === "string" ? raw.couponData.name : "",
          couponDiscountAmount: raw.couponData.couponDiscountAmount,
        }
      : null;

  return {
    id: raw.id,
    name: raw.name,
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : "",
    price,
    finalPrice: typeof raw.finalPrice === "number" ? raw.finalPrice : price,
    discountPercentage: typeof raw.discountPercentage === "number" ? raw.discountPercentage : 0,
    isFreeCourse: raw.isFreeCourse === 1,
    resources: {
      files: typeof resources.files === "number" ? resources.files : 0,
      videos: typeof resources.videos === "number" ? resources.videos : 0,
      tests: typeof resources.tests === "number" ? resources.tests : 0,
    },
    likes:
      raw.likes && typeof raw.likes.value === "string" && !Number.isNaN(Number(raw.likes.value))
        ? Number(raw.likes.value)
        : 0,
    subscriberCount: typeof raw.totalSubscriberCount === "number" ? raw.totalSubscriberCount : 0,
    courseTags: Array.isArray(raw.courseTags)
      ? raw.courseTags.map((t) => (t && typeof t.text === "string" ? t.text : "")).filter(Boolean)
      : [],
    isCertificateEnabled: raw.isCertificateEnabled === 1,
    coupon,
    enrollUrl,
  };
}

// Server-only: talks to Classplus's public course-preview endpoint directly
// (same catalog data shown on the public acmea.courses.store storefront, no
// auth required). Returns the full "all" catalog bucket; falls back to the
// curated "featured"/"popular" buckets only if "all" comes back empty.
export async function fetchClassplusCourses(): Promise<ClassplusCoursesResult> {
  try {
    const url = new URL(CLASSPLUS_COURSE_PREVIEW_URL);
    url.searchParams.set("subCatList", "[]");
    url.searchParams.set("mainCategory", "0");

    const res = await fetch(url.toString(), {
      headers: {
        "api-version": "22",
        "accept-language": "EN",
        region: "IN",
        origin: CLASSPLUS_STORE_ORIGIN,
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) return { courses: [], error: true };

    const json = await res.json();
    // "all" is the full catalog — shown in full on the homepage. Only fall
    // back to the curated buckets if Classplus ever returns "all" empty.
    const buckets: unknown[] = [json?.data?.all, json?.data?.featured, json?.data?.popular];
    const rawCourses: RawCourse[] =
      buckets
        .map((b) => {
          const list = (b as { coursesData?: unknown } | undefined)?.coursesData;
          return Array.isArray(list) ? (list as RawCourse[]) : [];
        })
        .find((list) => list.length > 0) ?? [];

    const courses = rawCourses.map(mapCourse).filter((c): c is ClassplusCourse => c !== null);
    return { courses, error: false };
  } catch {
    return { courses: [], error: true };
  }
}
