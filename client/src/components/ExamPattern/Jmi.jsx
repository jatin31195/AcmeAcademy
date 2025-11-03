import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Info, Award } from "lucide-react";

const JMI = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

 
  const parts = [
    {
      part: "Section-I",
      subject: "Mathematics",
      questions: "40% (Approx.)",
      marks: "Major Weightage",
    },
    {
      part: "Section-II",
      subject: "Computer Fundamentals & Awareness",
      questions: "40% (Approx.)",
      marks: "Major Weightage",
    },
    {
      part: "Section-III",
      subject: "Reasoning",
      questions: "10% (Approx.)",
      marks: "Moderate",
    },
    {
      part: "Section-IV",
      subject: "General English",
      questions: "10% (Approx.)",
      marks: "Moderate",
    },
  ];

  const syllabus = {
    "Mathematics (CBSE/10+2 Level)": [
      "Sets, Relations & Functions, Ordered pairs, Cartesian product, Typical functions",
      "Complex Numbers & Quadratic Equations, Argand Plane, Polar representation",
      "Binomial Theorem, Pascal’s Triangle, General/Middle term",
      "Permutations, Combinations, Probability, Conditional probability, Bayes’ theorem, Random variables, Binomial distribution",
      "Sequences & Series (AP, GP, AM, GM, Sum formulas)",
      "Mathematical Reasoning – Statements, Converse, Contra-positive",
      "Statistics – Mean, Variance, SD, Frequency distributions",
      "Matrices & Determinants, Row/Column operations, Inverse, System of equations",
      "Limits, Continuity, Differentiability, Derivatives & Applications",
      "Integrals & Applications – Substitution, Partial fractions, By parts",
      "Differential Equations – Order, Degree, Solutions, Linear & Homogeneous",
      "Linear Programming – Formulation, Graphical method",
    ],

    "Computer Fundamentals & Awareness": [
      "Computer Organization: CPU, Fetch-Execute Cycle, I/O devices",
      "Number Systems: Binary, Octal, Decimal, Hexadecimal & Conversions",
      "Data Representation: ASCII, Unicode, Negative & Real numbers",
      "Logic Gates & Circuits – AND, OR, NOT, XOR, NAND, NOR, Adders, Multiplexers",
      "Programming Languages: Machine, Assembly, Procedural vs OOP",
      "System Programs: Compiler, Interpreter, Loader, Linker, OS",
      "Memory: Cache, RAM, ROM, Secondary Storage, Hierarchy",
      "Internet basics, Popular companies & current trends",
      "C Programming – Data types, Operators, Control structures, Functions, Arrays, Strings, Pointers, Structures, File Handling",
    ],

    Reasoning: [
      "Logical, Symbolic, Verbal & Non-verbal Reasoning",
      "Odd-man out, Matching, Differences, Similarities",
      "Number series, Alphabet series",
      "Direction sense, Coding-Decoding, Arithmetic reasoning",
      "Blood relations, Analogy, Decision making",
      "Non-verbal series, Mirror images, Common fallacies",
    ],

    "General English": [
      "Tenses – Present, Past, Future",
      "Active & Passive voice, Direct & Indirect Speech",
      "Prepositions, Conjunctions, Degree of Comparison",
      "Sentence Types – Simple, Complex, Compound",
      "Verb Forms, Punctuation",
      "Synonyms, Antonyms, Homonyms",
    ],
  };

  return (
    <div className="space-y-10">
     

      {/* TABS */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        {/* Tab Buttons */}
        <TabsList className="flex flex-wrap justify-center bg-gray-50 border p-2 rounded-2xl shadow-sm mb-8">
          {[
            { value: "overview", label: "Overview" },
            { value: "syllabus", label: "Syllabus" },
            { value: "criteria", label: "Qualifying Criteria" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 font-semibold rounded-xl transition-all data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-pink-400 data-[state=active]:to-red-400"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-blue-700">
                  <Info /> Exam Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parts.map((p, i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-xl bg-gray-50 hover:bg-white transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <h3 className="font-semibold text-gray-800">
                        {p.part}: {p.subject}
                      </h3>
                      <div className="flex gap-4 mt-2 md:mt-0">
                        <Badge>{p.questions}</Badge>
                        <Badge>{p.marks}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="mt-4 text-sm text-gray-500">
                  • Multiple-choice questions only.<br />
                  • Distribution: 40% Maths, 40% Computer, 10% Reasoning, 10% English.<br />
                  • Duration: 2 hours.<br />
                  • Marking scheme as per university guidelines (+1 for correct, negative if applicable).
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* SYLLABUS */}
        <TabsContent value="syllabus">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {Object.entries(syllabus).map(([subject, topics]) => (
              <Card
                key={subject}
                className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600 font-semibold">
                    <BookOpen className="w-5 h-5" /> {subject}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {topics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* QUALIFYING CRITERIA */}
        <TabsContent value="criteria">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 font-semibold">
                  <Award className="w-5 h-5" /> Qualifying Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                  <li>Selection based on entrance test rank.</li>
                  <li>Merit list prepared from total marks scored.</li>
                  <li>Negative marking policy (if any) declared by university.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JMI;
