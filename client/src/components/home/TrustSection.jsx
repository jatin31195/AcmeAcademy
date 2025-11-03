import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Target, BookOpen, PlayCircle } from "lucide-react";

const statsData = [
  { icon: Users, value: 2000, suffix: "+", label: "Satisfied Students" },
  { icon: Target, value: 92, suffix: "%", label: "Selection Ratio" },
  { icon: BookOpen, value: 650, suffix: "+", label: "Mock Tests" },
  { icon: PlayCircle, value: 1500, suffix: "+", label: "Video Lectures" },
];

const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

const TrustSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 py-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-100/30 to-transparent blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          India’s Most Trusted{" "}
          <span className="gradient-text">MCA Entrance Academy</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground mb-12"
        >
          With <span className="font-semibold text-primary">ACME Academy</span>,
          begin your journey to success.
        </motion.p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500"
              >
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  <Counter end={item.value} />
                  <span className="text-primary">{item.suffix}</span>
                </h3>
                <p className="text-sm md:text-base text-gray-600 mt-2">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
