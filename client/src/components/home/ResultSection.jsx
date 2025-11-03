import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import resultSample1 from "../../assets/images/acme-poster.jpg";
import resultSample2 from "../../assets/images/ACMEs-CUET-MCA-2024.png";
import resultSample3 from "../../assets/images/mah-mca-cet-2024-result.png";
import resultSample4 from "../../assets/images/acme-banner.jpg";
import resultSample5 from "../../assets/images/Results.jpg";
import resultSample6 from "../../assets/images/nimcet-2024-result.png";

const ResultsSection = () => {
  const resultImages = [
    { src: resultSample1, title: "NIMCET 2025 Toppers", exam: "NIMCET", year: "2025" },
    { src: resultSample2, title: "CUET-PG 2024 Results", exam: "CUET-PG", year: "2024" },
    { src: resultSample3, title: "MAH-CET 2024 Achievers", exam: "MAH-CET", year: "2024" },
    { src: resultSample4, title: "NIMCET 2024 Success Story", exam: "NIMCET", year: "2024" },
    { src: resultSample5, title: "BIT MCA 2024 Results", exam: "BIT MCA", year: "2024" },
    { src: resultSample6, title: "JMI MCA 2024 Toppers", exam: "JMI MCA", year: "2024" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % resultImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [resultImages.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % resultImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + resultImages.length) % resultImages.length);

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 py-16 overflow-hidden">
      
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-3">
          Outstanding <span className="text-primary gradient-text">Results</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Celebrating the success of our MCA entrance exam toppers
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative w-full max-w-6xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={resultImages[current].src}
            alt={resultImages[current].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

   
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

       
        <motion.div
          key={current + "-caption"}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md text-white px-6 py-4 rounded-xl border border-white/20 max-w-sm"
        >
          <h3 className="text-xl font-semibold mb-1">{resultImages[current].title}</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-primary/80 px-3 py-1 rounded-full">{resultImages[current].exam}</span>
            <span className="bg-white/30 px-3 py-1 rounded-full">{resultImages[current].year}</span>
          </div>
        </motion.div>

       
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      
        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
          {resultImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === current ? "bg-white scale-125" : "bg-gray-400 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      
      <div className="text-center mt-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold">
          <span className="gradient-text">Acme </span> मतलब{" "}
          <span className="gradient-text">Selection </span>की<span className="gradient-text"> GUARANTEE</span> 
        </h2>
      </div>
    </section>
  );
};

export default ResultsSection;
