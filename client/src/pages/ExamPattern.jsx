import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Nimcet2025 from "../components/ExamPattern/Nimcet2025";
import Cuetpg from "../components/ExamPattern/Cuetpg";
import Mahcet from "../components/ExamPattern/Mahcet";
import Jmi from "../components/ExamPattern/Jmi.jsx";
import Vit from "../components/ExamPattern/VIT";

const ExamPattern = () => {
  const examPatterns = [
    { id: "nimcet", name: "NIMCET" },
    { id: "cuet-pg", name: "CUET-PG" },
    { id: "mah-cet", name: "MAH-CET" },
    { id: "jmi", name: "JMI MCA" },
    { id: "vit", name: "VIT MCA" }
  ];

  const [selectedExam, setSelectedExam] = useState("nimcet");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Page Header */}
      <section className="py-30 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Exam <span className="block gradient-text">Patterns</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Detailed exam patterns, marking schemes, and section-wise analysis for all major MCA entrance examinations to help you prepare strategically.
          </p>
        </div>
      </section>

      {/* Exam Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={selectedExam} onValueChange={setSelectedExam} className="cursor-pointer w-full">
            <TabsList className="cursor-pointer grid w-full grid-cols-2 md:grid-cols-5 mb-4">
              {examPatterns.map((exam) => (
                <TabsTrigger key={exam.id} value={exam.id} className="text-sm">
                  {exam.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
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
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ExamPattern;
