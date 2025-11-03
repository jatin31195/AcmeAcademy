import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, School } from "lucide-react";

const VIT = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // ==========================
  // DATA
  // ==========================
  const parts = [
    { part: "Section-I", subject: "Mathematics", questions: "Major Weightage", marks: "Approx. 40%" },
    { part: "Section-II", subject: "Computer Science & Programming", questions: "Major Weightage", marks: "Approx. 40%" },
    { part: "Section-III", subject: "English Communication", questions: "Moderate Weightage", marks: "Approx. 20%" },
  ];

  const syllabus = {
    Mathematics: [
      "Algebra: Fundamental operations, Expansion, Factorization, Quadratic equations, Indices, Logarithms",
      "Progressions: Arithmetic, Geometric, Harmonic, Binomial theorem, Permutations & Combinations",
      "Calculus: Functions, Limits, Continuity, Differentiability, Mean value theorems, L'Hospital rule",
      "Maxima & Minima, Taylor series, Fundamental and Mean value theorems of integral calculus",
      "Total derivatives, Lagrange method of multipliers",
      "Differential Equations: First order, Linear with constant coefficients, Homogeneous linear differential equations",
      "Probability: Dependent & independent events, Frequency distributions, Measures of dispersion, Skewness & Kurtosis",
      "Random variables & distribution functions, Expectation, Binomial, Poisson, Normal distributions",
      "Algebra & Complex Analysis: Matrices, Rank & Determinant, Eigenvalues & Eigenvectors, Cayley-Hamilton theorem",
      "Quadratic forms, Canonical forms, Diagonal & Triangular forms, Analytic functions, Cauchy-Riemann equations, Contour integral, Cauchy's theorem, Taylor & Laurent series, Conformal mappings, Mobius transformations, Fourier series",
      "Calculus & Applications: Linear ODEs, Variation of parameters, Sturm-Liouville problem",
      "PDEs: Classification, General solutions, Separation of variables, Laplace, Heat, Wave equations",
      "Transformation techniques: Laplace, Fourier, Z-transformations"
    ],

    "Computer Science & Programming": [
      "Algorithms: Analysis, Asymptotic notation, Time & Space complexity, Greedy, Dynamic programming, Divide and conquer",
      "Data Structures: Arrays, Stacks, Queues, Linked Lists, Trees, Graphs, Traversals, Sorting & Searching techniques",
      "Computer Networks: Network models, OSI model, Transmission, Error detection & correction",
      "Programming in C: Data types, Operators, Control structures, Functions, Recursion, Arrays, Pointers",
      "DBMS: E-R Model, Normalization, SQL, Query processing",
      "Operating Systems: Process management, CPU Scheduling, Synchronization, Deadlock, Memory management",
      "Computer Architecture: Logic gates, Arithmetic, Circuits, Memory, Instruction cycle, Von Neumann Architecture"
    ],

    "English Communication": [
      "Grammar: Subject-Verb Agreement, Tenses, Voices, Articles, Prepositions, Conjunctions",
      "Technical Writing, Memos, Proof Reading, Vocabulary"
    ]
  };

  const institutes = [
    { 
      name: "Vellore Institute of Technology (VIT)", 
      contact: "Director - PG Admissions, VIT, Vellore – 632014, +91-416-2202050 / 2055 / 2060 / 2188", 
      email: "mcaadmission@vit.ac.in" 
    },
    { campus: "VIT Vellore", program: "Master of Computer Applications [MCA]", duration: "2 years (4 semesters)" },
    { campus: "Chennai Campus", program: "Master of Computer Applications [MCA]", duration: "2 years (4 semesters)" },
    { campus: "VIT-Bhopal", program: "Master of Computer Applications [MCA]", duration: "2 years (4 semesters)" },
  ];

  const eligibility = [
    "Graduation with minimum 60% (First Class) from recognized university in BCA/B.Sc (CS)/B.Sc (IT).",
    "Consistent academic record in 10th and 12th required.",
    "Final year students may also apply.",
    "Final exams should be completed before selection counselling.",
    "Mathematics must be a subject at 10+2 or graduation level.",
    "Equivalent degrees accepted with Computer Science and Mathematics majors (subject to equivalence certificate)."
  ];

  // ==========================
  // COMPONENT
  // ==========================
  return (
    <div className="space-y-8">
      {/* Tabs Section */}
     
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Tabs List */}
          <TabsList
            className="
              flex flex-wrap justify-center items-center gap-3 sm:gap-4 p-2 sm:p-3 mb-10
              bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md
            "
          >
            {["overview", "syllabus", "criteria", "institutes"].map((tab, i) => (
              <TabsTrigger
                key={i}
                value={tab}
                className="
                  text-xs sm:text-sm md:text-base font-semibold tracking-wide px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl
                  text-gray-700 transition-all duration-300 ease-in-out
                  hover:bg-gradient-to-r hover:from-blue-500 hover:via-pink-400 hover:to-red-400 hover:text-white
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-pink-400 data-[state=active]:to-red-400
                  data-[state=active]:text-white shadow-sm data-[state=active]:shadow-md
                "
              >
                {tab === "overview" ? "Overview" : 
                 tab === "syllabus" ? "Syllabus" : 
                 tab === "criteria" ? "Eligibility" : "Institutes"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                    Exam Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {parts.map((p, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-xl bg-white/50 backdrop-blur-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {p.part}: {p.subject}
                        </h3>
                        <div className="flex gap-3 mt-3 md:mt-0">
                          <Badge>{p.questions}</Badge>
                          <Badge>{p.marks}</Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                    • Type: Multiple Choice Questions <br />
                    • Weightage: Mathematics 40%, Computer Science 40%, English 20% <br />
                    • Duration: 2 hours <br />
                    • Negative marking may apply as per VITMEE guidelines.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Syllabus Tab */}
          <TabsContent value="syllabus">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Object.entries(syllabus).map(([sub, topics], i) => (
                <Card
                  key={i}
                  className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                      <BookOpen className="h-5 w-5 text-blue-500" /> {sub}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                      {topics.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          {/* Eligibility Tab */}
          <TabsContent value="criteria">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                    {eligibility.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Institutes Tab */}
          <TabsContent value="institutes">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {institutes.map((inst, i) => (
                <Card
                  key={i}
                  className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                      <School className="h-5 w-5 text-blue-500" /> {inst.name || inst.campus}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-700">
                    {inst.contact && <p><strong>Contact:</strong> {inst.contact}</p>}
                    {inst.email && <p><strong>Email:</strong> {inst.email}</p>}
                    {inst.program && <p><strong>Program:</strong> {inst.program}</p>}
                    {inst.duration && <p><strong>Duration:</strong> {inst.duration}</p>}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
    
    </div>
  );
};

export default VIT;
