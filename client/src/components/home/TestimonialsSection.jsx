import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Tanmay Mandal",
      exam: "NIMCET 2022",
      rank: "AIR 5",
      image: "TM",
      rating: 5,
      testimonial:
        "ACME Academy’s test series were a game-changer! I improved consistently with daily practice and guidance from the best mentors.",
      college: "NIT Trichy",
    },
    {
      name: "Rahul Kumar",
      exam: "CUET-PG MCA 2024",
      rank: "AIR 15",
      image: "RK",
      rating: 5,
      testimonial:
        "The personal mentorship and structured study plan at ACME helped me stay focused and confident throughout my prep.",
      college: "JNU Delhi",
    },
    {
      name: "Ananya Gupta",
      exam: "MAH-CET MCA 2024",
      rank: "AIR 8",
      image: "AG",
      rating: 5,
      testimonial:
        "Regular assessments and interactive lectures gave me the clarity I needed to excel. Thank you ACME for making learning fun!",
      college: "VJTI Mumbai",
    },
    {
      name: "Vikash Singh",
      exam: "JMI MCA 2024",
      rank: "AIR 12",
      image: "VS",
      rating: 5,
      testimonial:
        "The detailed PYQ solutions and mock tests were super helpful in strengthening my weak topics before the exam.",
      college: "Jamia Millia Islamia",
    },
    {
      name: "Sneha Patel",
      exam: "BIT MCA 2024",
      rank: "AIR 5",
      image: "SP",
      rating: 5,
      testimonial:
        "ACME Academy’s video lectures and doubt sessions made preparation seamless even with my college schedule.",
      college: "BIT Mesra",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setStartIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  const visibleTestimonials = [
    testimonials[startIndex],
    testimonials[(startIndex + 1) % testimonials.length],
    testimonials[(startIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            What Our <span className="gradient-text">Students Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences. Real success. Here’s what our toppers think about ACME.
          </p>
        </motion.div>

        {/* Compact Horizontal Slider */}
        <div className="relative flex items-center ">
          <button
            onClick={prevSlide}
            className="absolute -left-2 md:-left-6 bg-white/60 hover:bg-indigo-100 text-indigo-700 rounded-full p-2 shadow-md transition-all z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex overflow-hidden w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={startIndex}
                className="flex gap-6 w-full justify-center mb-4"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {visibleTestimonials.map((t, idx) => (
                  <Card
                    key={idx}
                    className="w-[300px] md:w-[340px] bg-white/70 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all rounded-2xl"
                  >
                    <CardContent className="p-6 text-center">
                      <Avatar className="h-14 w-14 mx-auto mb-4 ring-4 ring-indigo-100">
                        <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold">
                          {t.image}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold text-lg text-gray-800 mb-1">
                        {t.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {t.rank} • {t.exam}
                      </p>
                      <p className="text-xs text-indigo-600 font-medium mb-2">
                        {t.college}
                      </p>
                      <div className="flex justify-center mb-3">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                        "{t.testimonial}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-2 md:-right-6 bg-white/60 hover:bg-indigo-100 text-indigo-700 rounded-full p-2 shadow-md transition-all z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
