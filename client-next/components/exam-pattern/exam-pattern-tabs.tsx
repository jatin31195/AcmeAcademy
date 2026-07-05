"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Nimcet2025 from "@/components/exam-pattern/nimcet2025";
import Cuetpg from "@/components/exam-pattern/cuetpg";
import Mahcet from "@/components/exam-pattern/mahcet";
import Jmi from "@/components/exam-pattern/jmi";
import Vit from "@/components/exam-pattern/vit";

const examPatterns = [
  { id: "nimcet", name: "NIMCET" },
  { id: "cuet-pg", name: "CUET-PG" },
  { id: "mah-cet", name: "MAH-CET" },
  { id: "jmi", name: "JMI MCA" },
  { id: "vit", name: "VIT MCA" },
];

// Client Island extracted from client/src/pages/ExamPattern.jsx: the tab
// switching state (useState + Radix Tabs) and the two motion.div wrappers
// around it. The page's SEO/hero markup stays a Server Component — Server
// Shell + Client Island split per the migration blueprint's component
// conversion plan (rather than making the whole page Client just because
// of this one interactive section).
export function ExamPatternTabs() {
  const [selectedExam, setSelectedExam] = useState("nimcet");

  return (
    <section className="relative py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Tabs value={selectedExam} onValueChange={setSelectedExam} className="w-full">
          {/* Tabs List */}
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

          {/* Content Section */}
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
  );
}
