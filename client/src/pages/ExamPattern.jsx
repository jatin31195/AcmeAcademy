import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Nimcet2025 from "../components/ExamPattern/Nimcet2025";
import Cuetpg from "../components/ExamPattern/Cuetpg";
import Mahcet from "../components/ExamPattern/Mahcet";
import Jmi from "../components/ExamPattern/Jmi";
import Vit from "../components/ExamPattern/VIT";

const ExamPattern = () => {
  const [selectedExam, setSelectedExam] = useState("nimcet");

  const examPatterns = [
    { id: "nimcet", name: "NIMCET" },
    { id: "cuet-pg", name: "CUET-PG" },
    { id: "mah-cet", name: "MAH-CET" },
    { id: "jmi", name: "JMI MCA" },
    { id: "vit", name: "VIT MCA" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
      {/* 🌈 Hero Section */}
       {/* 🌊 Hero Section */}
      <section className="relative py-16 sm:py-30 text-center overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"></div>
         <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
                  >
                    <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
                       Explore
                    </span>{" "}
                    <span className="text-white">MCA Exam Patterns</span>
                  </motion.h1>
                  <p className="text-gray-800 text-lg sm:text-xl  max-w-3xl mx-auto">
             Get detailed <b>structure, syllabus, and marking scheme</b> for every top MCA
          entrance exam — all in one place.
          </p>
       

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
              fill="white"
            />
          </svg>
        </div>
      </section>
      

      {/* 📘 Exam Tabs */}
      <section className="relative py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Tabs
            value={selectedExam}
            onValueChange={setSelectedExam}
            className="w-full"
          >
            {/* 🔹 Tabs List */}
            <TabsList
              className="
                w-full max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-2
                bg-white/60 backdrop-blur-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                p-2 rounded-3xl transition-all
              "
            >
              {examPatterns.map((exam) => (
                <TabsTrigger
                  key={exam.id}
                  value={exam.id}
                  className={`
                    px-4 sm:px-6 py-2.5 text-sm sm:text-base font-semibold tracking-wide 
                    rounded-2xl transition-all duration-300
                    text-gray-800 hover:text-white
                    hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-pink-500
                    data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(147,51,234,0.4)]
                  `}
                >
                  {exam.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* 🔹 Content Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-100 p-4 sm:p-10"
            >
              <TabsContent value="nimcet">
                <Nimcet2025 />
              </TabsContent>
              <TabsContent value="cuet-pg">
                <Cuetpg />
              </TabsContent>
              <TabsContent value="mah-cet">
                <Mahcet />
              </TabsContent>
              <TabsContent value="jmi">
                <Jmi />
              </TabsContent>
              <TabsContent value="vit">
                <Vit />
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </section>
    </div>
  );
};

export default ExamPattern;
