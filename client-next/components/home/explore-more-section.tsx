import Link from "next/link";
import { Dumbbell, Library, FileText, Compass, ListChecks, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

// Ported from client/src/components/home/ExploreMoreSection.jsx. Purely
// static internal-linking hub (no fetch, no local state) — only the
// entrance animation needs Client, so it's Server shell + <Reveal> Motion
// Wrapper per item, per the migration blueprint's component conversion plan.
const links: { to: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    to: "/acme-practice-sets",
    icon: Dumbbell,
    title: "Practice Sets",
    description: "Topic-wise practice questions with instant solutions.",
  },
  {
    to: "/acme-academy-open-library",
    icon: Library,
    title: "Open Library",
    description: "Free notes, video lectures, and self-study courses.",
  },
  {
    to: "/pyq",
    icon: FileText,
    title: "Previous Year Papers",
    description: "Solve real NIMCET, CUET-PG & MAH-CET question papers.",
  },
  {
    to: "/nimcet-rank-predictor",
    icon: Compass,
    title: "Rank Predictor",
    description: "Estimate your NIMCET rank from your expected score.",
  },
  {
    to: "/exam-pattern",
    icon: ListChecks,
    title: "Exam Pattern",
    description: "Syllabus, marking scheme, and structure for every MCA exam.",
  },
];

const ExploreMoreSection = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100" aria-labelledby="explore-more-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="explore-more-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
            Everything You Need to Crack Your MCA Entrance
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            The same free resources our AIR 1 and top performers used to prepare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {links.map((item, i) => (
            <Reveal
              key={item.to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={item.to}
                className="group flex flex-col items-center text-center gap-3 h-full p-5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <div className="bg-indigo-100 group-hover:bg-indigo-600 transition-colors p-3 rounded-full">
                  <item.icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMoreSection;
