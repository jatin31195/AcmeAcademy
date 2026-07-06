import { PlayCircle, MessageCircle, BookOpen, BarChart, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

// Ported from client/src/components/home/WhyChooseUs.jsx. Static content,
// Server shell + <Reveal> Motion Wrapper (same rationale as HowItWorks).
const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: PlayCircle,
    title: "Live / Recorded Lectures",
    desc: "Learning is the first step toward achieving your dreams. We motivate students to explore concepts deeply instead of memorizing. Registered students can access demo live and recorded lectures anytime.",
  },
  {
    icon: MessageCircle,
    title: "Live Doubt Solving Sessions",
    desc: "We encourage students to ask questions freely. ACME Academy ensures an open environment where doubts are cleared instantly — because the more you ask, the more you learn.",
  },
  {
    icon: Users,
    title: "Experienced Faculty",
    desc: "All our mentors are NIT, JNU, and BIT alumni with years of MCA exam training experience. Their mentorship helps students crack tough exams with strategy and precision.",
  },
  {
    icon: BookOpen,
    title: "Valuable Study Material",
    desc: "ACME Academy is your one-stop platform for MCA preparation. Our structured material sharpens your problem-solving and concept-building skills — trusted by thousands of students nationwide.",
  },
  {
    icon: BarChart,
    title: "Regular Test & Progress Tracking",
    desc: "With our series of mock tests and progress analysis, students get comfortable with every question pattern and exam situation, ensuring confidence and consistency.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-blue-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-indigo-100/20 to-transparent blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <Reveal initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-4">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Why <span className="gradient-text">ACME Academy?</span>
          </h2>
        </Reveal>

        <Reveal
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-lg md:text-xl text-gray-600">
            Your <span className="font-semibold text-primary">Success</span> is Our{" "}
            <span className="font-semibold text-indigo-500">Guarantee</span>
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((item, index) => (
            <Reveal
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-indigo-50/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />

              <div className="p-8 relative z-10 flex flex-col items-center text-center">
                <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-4 rounded-full text-white shadow-md mb-5 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
