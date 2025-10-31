import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import logo from "/logo.png";

const PastGallery = ({ galleryData = [] }) => {
  if (!galleryData.length) {
    return (
      <div className="text-center text-gray-500 py-16 text-lg">
        No gallery images available.
      </div>
    );
  }

  const sliderImages = galleryData.slice(0, 6);
  const remainingImages = galleryData.slice(6);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
   
      <motion.h2
        className="text-[clamp(1.8rem,4vw,2.6rem)] font-semibold text-center text-gray-900 mb-10 tracking-tight flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
       <img
          src={logo}
          alt="ACME Logo"
          className="w-10 h-10 object-contain "
        />
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          ACME Academy
        </span>
        <span className="font-bold text-gray-800">– Past Memories</span>
      </motion.h2>

     
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scroll-smooth"
      >
        {sliderImages.map((item, index) => (
          <motion.div
            key={item._id || index}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[340px] bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-200 group relative"
          >
           
            <img
              src={logo}
              alt="Logo"
              className="absolute w-16 opacity-18 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />

           
            <div className="relative h-52 overflow-hidden">
              <img
                src={item.url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white text-sm font-semibold hover:underline"
                >
                  View Full <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Text Section */}
            <div className="p-3 text-center">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {item.eventName || "ACME Academy"}
              </h3>
              {item.year && (
                <p className="text-sm text-gray-600 mt-1">{item.year}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

  
      <div className="flex justify-center mt-4">
        <p className="text-gray-500 text-sm flex items-center gap-2">
          👉 Scroll horizontally to explore more memories
        </p>
      </div>

     
      {remainingImages.length > 0 && (
        <div className="mt-12 grid gap-10">
          {remainingImages.map((item, index) => (
            <motion.div
              key={item._id || `full-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl bg-white border border-gray-200 group"
            >
             
              <img
                src={logo}
                alt="Logo"
                className="absolute left-1/2 top-1/2 w-28 opacity-18 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              />

              <img
                src={item.url}
                alt={`Gallery ${index + 7}`}
                className="w-full h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-center items-center text-white">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white text-sm sm:text-base font-semibold hover:underline"
                >
                  View Full <ExternalLink className="w-4 h-4" />
                </a>
                {(item.year || item.eventName) && (
                  <p className="mt-1 text-xs sm:text-sm font-medium text-gray-200">
                    {item.eventName ? item.eventName : "ACME Academy"}{" "}
                    {item.year ? `• ${item.year}` : ""}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PastGallery;
