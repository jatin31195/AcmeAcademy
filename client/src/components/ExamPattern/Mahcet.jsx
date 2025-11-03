// src/pages/Mahcet.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Award, University, Info } from "lucide-react";

const Mahcet = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  const parts = [
    { subject: "Mathematics & Statistics", questions: 30, marks: 60, correct: "+2", wrong: "No negative" },
    { subject: "Logical / Abstract Reasoning", questions: 30, marks: 60, correct: "+2", wrong: "No negative" },
    { subject: "English Comprehension & Verbal Ability", questions: 20, marks: 40, correct: "+2", wrong: "No negative" },
    { subject: "Computer Concepts", questions: 20, marks: 40, correct: "+2", wrong: "No negative" },
  ];

  const syllabus = {
    "Mathematics & Statistics": [
      "Algebra: Operations, Expansion, Factorization, Quadratic equations, Indices, Logarithms, Progressions, Binomial theorem, Permutations & Combinations",
      "Coordinate Geometry: Cartesian coordinates, Line equations, Midpoint, Intersections, Circle equations, Distance formula, Pair of lines, Parabola, Ellipse, Hyperbola, Geometric transformations (translation, rotation, scaling)",
      "Differential Equations: First-order, Linear DE with constant coefficients, Homogeneous DE",
      "Trigonometry: Identities, Equations, Properties of triangles, Solutions, Heights & Distances, Inverse functions",
      "Probability & Statistics: Probability basics, Averages, Events, Frequency distributions, Dispersion, Skewness, Kurtosis, Random variables, Distributions (Binomial, Poisson, Normal), Curve fitting, Least squares, Correlation & Regression",
      "Arithmetic: Ratios, Proportions, Time-Work, Speed-Distance, Percentages",
      "Basic Set Theory & Functions: Sets, Relations, Mappings",
      "Mensuration: Areas, Circles, Volumes & Surface Areas of solids (cube, sphere, cylinder, cone)",
    ],
    "Logical / Abstract Reasoning": [
      "Fact-based reasoning",
      "Problem solving",
      "Abstract & logical situations",
      "Quick decision making",
    ],
    "English Comprehension & Verbal Ability": [
      "Grammar basics",
      "Vocabulary, Synonyms, Antonyms",
      "Reading comprehension",
      "Sentence correction",
      "Word & phrase usage",
      "Jumbled paragraphs",
    ],
    "Computer Concepts": [
      "Computer Basics: CPU, Instruction structure, I/O devices, Memory & backup devices",
      "Data Representation: Characters, Integers, Fractions, Binary & Hexadecimal, Arithmetic (Add/Subtract/Multiply/Divide), Signed & Two’s complement, Floating-point representation, Boolean algebra, Truth tables, Venn diagrams",
      "Computer Architecture: Digital logic basics, Block structure, Processor-I/O communication, Interrupts",
      "Computer Language: Data & File Structures, High-level languages, Programming in C, Advanced programming concepts",
      "Operating System basics",
    ],
  };

  const institutes = [
    { name: "Government & Private Institutes in Maharashtra", contact: "Admissions via CET Cell Maharashtra", email: "cetcell@mahacet.org" },
  ];

  return (
    <div className="space-y-10">
     

      {/* TABS */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full max-w-7xl mx-auto px-4">
        <TabsList className="flex flex-wrap justify-center bg-gray-50 border p-2 rounded-2xl shadow-sm">
          <TabsTrigger
            value="overview"
            className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-pink-400 data-[state=active]:to-red-400 rounded-xl transition-all"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="syllabus"
            className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-pink-400 data-[state=active]:to-red-400 rounded-xl transition-all"
          >
            Syllabus
          </TabsTrigger>
          <TabsTrigger
            value="criteria"
            className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-pink-400 data-[state=active]:to-red-400 rounded-xl transition-all"
          >
            Criteria
          </TabsTrigger>
          <TabsTrigger
            value="institutes"
            className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-pink-400 data-[state=active]:to-red-400 rounded-xl transition-all"
          >
            Institutes
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-blue-700">
                  <Info /> Exam Structure & Marking Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parts.map((p, i) => (
                  <div key={i} className="p-4 border rounded-xl bg-gray-50 hover:bg-white transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <h3 className="font-semibold text-gray-800">{p.subject}</h3>
                      <div className="flex gap-4 mt-2 md:mt-0">
                        <Badge>{p.questions} Qs</Badge>
                        <Badge>{p.marks} Marks</Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-green-600">Correct: {p.correct}</span>
                      <span className="text-red-600">Wrong: {p.wrong}</span>
                    </div>
                  </div>
                ))}
                <p className="mt-4 text-sm text-gray-500">
                  • 200 Marks total (100 Questions). <br />
                  • No negative marking. <br />
                  • Composite time of 90 minutes. <br />
                  • Online Computer-Based Test (CBT). <br />
                  • Medium: English only.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* SYLLABUS */}
        <TabsContent value="syllabus">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid md:grid-cols-2 gap-6">
            {Object.entries(syllabus).map(([subject, topics]) => (
              <Card key={subject} className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600 font-semibold">
                    <BookOpen className="w-5 h-5" /> {subject}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {topics.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* CRITERIA */}
        <TabsContent value="criteria">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 font-semibold">
                  <Award className="w-5 h-5" /> Qualifying Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                  <li>No negative marking. Every correct answer = +2 marks.</li>
                  <li>Ranking based on total score out of 200.</li>
                  <li>Preference given to candidates with higher total marks.</li>
                  <li>In case of ties: CET Cell rules apply (Maths → Reasoning → Age).</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* INSTITUTES */}
        <TabsContent value="institutes">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid md:grid-cols-2 gap-6">
            {institutes.map((inst, i) => (
              <Card key={i} className="bg-white/80 border border-gray-100 backdrop-blur-md rounded-3xl p-4 hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600 font-semibold">
                    <University className="w-5 h-5" /> {inst.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{inst.contact}</p>
                  <p className="text-sm text-gray-500">{inst.email}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Mahcet;
