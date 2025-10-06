import React from "react";
import { motion } from "framer-motion";  
import sampleImg from "../assets/images/acme-banner.jpg";  


const resultImages = [
  "../assets/images/results.jpg",
  "../assets/images/results.jpg",
  "../assets/images/results.jpg",
  
];

const Results = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div
        className="relative w-full h-72 md:h-96 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0072CE, #66CCFF)",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <h1 className="relative text-white text-4xl md:text-6xl font-bold text-center leading-tight pt-24 md:pt-32">
          ACME Academy <br /> Success Stories & Results
        </h1>
        <p className="relative text-white/90 text-lg md:text-2xl text-center mt-4">
          Proudly presenting our achievers & their bright futures
        </p>
      </div>

      
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {resultImages.map((src, idx) => (
              <motion.div
                key={idx}
                className="overflow-hidden rounded-lg shadow-lg bg-white"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <img
                  src={src}
                  alt={`Result ${idx + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-800">
                    
                    Student Name
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Scored: 98% | Course: MCA Entrance
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

 
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          >
            Achieve What You Dream With ACME Academy
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          >
            Our students don’t just pass — they outperform. See your name here next year.
          </motion.p>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }}
          >
            Join ACME Now
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} ACME Academy. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Results;
