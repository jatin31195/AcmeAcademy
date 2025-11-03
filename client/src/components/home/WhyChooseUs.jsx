import { motion } from "framer-motion";
import { PlayCircle, MessageCircle, BookOpen, BarChart, Users } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
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

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-blue-50 overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-indigo-100/20 to-transparent blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          Why <span className="gradient-text">ACME Academy?</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-600 mb-16"
        >
          Your <span className="font-semibold text-primary">Success</span> is Our{" "}
          <span className="font-semibold text-indigo-500">Guarantee</span>
        </motion.p>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-indigo-50/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />

              <div className="p-8 relative z-10 flex flex-col items-center text-center">
                <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-4 rounded-full text-white shadow-md mb-5 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
