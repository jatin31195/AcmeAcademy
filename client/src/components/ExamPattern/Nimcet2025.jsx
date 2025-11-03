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

const Nimcet2025 = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

   const parts = [
    {
      part: "Part-I",
      subject: "Mathematics",
      time: "70 minutes (2:00 PM – 3:10 PM)",
      questions: 50,
      marks: 600,
      correct: "+12",
      wrong: "–3",
    },
    {
      part: "Part-II",
      subject: "Analytical Ability & Logical Reasoning",
      time: "30 minutes (3:10 PM – 3:40 PM)",
      questions: 40,
      marks: 240,
      correct: "+6",
      wrong: "–1.5",
    },
    {
      part: "Part-III",
      subject: "Computer Awareness",
      time: "20 minutes (3:40 PM – 4:00 PM)",
      questions: 20,
      marks: 120,
      correct: "+6",
      wrong: "–1.5",
    },
    {
      part: "Part-III",
      subject: "General English",
      time: "Within Part-III",
      questions: 10,
      marks: 40,
      correct: "+4",
      wrong: "–1",
    },
  ];

  const syllabus = {
  Mathematics: [
    "Set Theory and Logic: Sets, Union, Intersection, Difference, Symmetric Difference, Cartesian Product, Functions & Relations, Venn Diagrams, Truth Tables, Tautology & Contradictions",
    "Probability & Statistics: Probability theory, Dependent/Independent events, Bayes' Theorem, Mean, Median, Mode, Standard Deviation, Variance, Moments, Frequency distributions",
    "Algebra: Quadratic equations, Relation between roots & coefficients, Symmetric functions of roots, Indices, Logarithms, Exponentials, Progressions (AP, GP, HP), Finite sums, Matrices & Determinants, Linear equations, Permutations & Combinations, Binomial Theorem",
    "Coordinate Geometry: Distance formula, Equation of line, Pair of lines, Circle, Parabola, Ellipse, Hyperbola, Section formula, Tangents & Normals",
    "Calculus: Limits, Continuity, Differentiation, Tangents & Normals, Maxima & Minima, Rolle’s Theorem, Mean Value Theorem, Integration (by parts, substitution, partial fractions), Definite integrals, Areas",
    "Trigonometry: Trigonometric functions & identities, Inverse functions, Properties of triangles, Solution of triangles, Heights & Distances, Trigonometric equations & solutions"
  ],

  "Analytical Ability & Logical Reasoning": [
    "Verbal & Non-verbal Reasoning, Deductive & Inductive Reasoning",
    "Blood relations, Coding-Decoding, Direction test, Seating arrangement, Puzzles, Input-Output",
    "Syllogism, Alphanumeric series, Mirror images, Statements & Conclusions/Arguments",
    "Problem solving, Critical thinking, Data Interpretation, Numerical Reasoning",
    "Data Sufficiency, Data Visualization"
  ],

  "Computer Awareness": [
    "Computer Basics: CPU, Instruction structure, I/O devices, Memory, Backup devices",
    "Data Representation: Characters, Integers, Fractions, Binary & Hex, Arithmetic (Addition, Subtraction, Multiplication, Division), Two’s complement, Floating point representation, Boolean algebra",
    "Computer Hardware: Input/Output devices, Storage (HDD, SSD, USB), Memory (RAM, ROM, Cache)",
    "Computer Software: Operating Systems (Windows, macOS, Linux, Android), System Software, Utility programs, Device drivers, Application Software",
    "Internet & Email: Web browsing, Email usage, Online security & threats"
  ],

  "General English": [
    "Comprehension of written text",
    "Vocabulary & Word usage",
    "Grammar & sentence structures",
    "Word formation, Meaning of words & phrases",
    "Technical writing, Accuracy & fluency in expression"
  ]
};


  const institutes = [
    { name: "NIT Agartala", contact: "Dr. Suyel Namasudra", email: "suyel.namasudra@nita.ac.in" },
    { name: "MNNIT Allahabad", contact: "Prof. Mayank Pandey", email: "mayankpandey@mnnit.ac.in" },
    { name: "MANIT Bhopal", contact: "Prof. Namita Srivastava", email: "sri.namita@gmail.com" },
    { name: "NIT Delhi", contact: "Dr. Amit Mahajan", email: "hodcs@nitdelhi.ac.in" },
    { name: "NIT Jamshedpur", contact: "Prof. D. A. Khan", email: "dakhan.cse@nitjsr.ac.in" },
    { name: "NIT Kurukshetra", contact: "Dr. Sandeep K Sood", email: "sandeepsood@nitkkr.ac.in" },
    { name: "NIT Meghalaya", contact: "Prof. Anup Dandapat", email: "anup.dandapat@nitm.ac.in" },
    { name: "NIT Patna", contact: "Prof. M. P. Singh", email: "mps@nitp.ac.in" },
    { name: "NIT Raipur", contact: "Prof. Priyanka Tripathi", email: "hod.mca@nitrr.ac.in" },
    { name: "NIT Warangal", contact: "Prof. Rashmi Ranjan Rout", email: "rashrr@nitw.ac.in" },
    { name: "IIIT Bhopal", contact: "Dr. Deep Chandra Joshi", email: "deepchandra.joshi@iiitbhopal.ac.in" },
    { name: "IIIT Vadodara", contact: "Dr. Naveen Kumar", email: "naveen_kumar@iiitvadodara.ac.in" },
  ];

  return (
    <div className="space-y-10">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="flex flex-wrap justify-center bg-gray-50 border p-2 rounded-2xl shadow-sm">
          <TabsTrigger value="overview" className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-pink-500 rounded-xl transition-all">Overview</TabsTrigger>
          <TabsTrigger value="syllabus" className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-pink-500 rounded-xl transition-all">Syllabus</TabsTrigger>
          <TabsTrigger value="criteria" className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-pink-500 rounded-xl transition-all">Criteria</TabsTrigger>
          <TabsTrigger value="institutes" className="px-4 py-2 font-semibold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-pink-500 rounded-xl transition-all">Institutes</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-indigo-700">
                  <Info /> Exam Structure & Marking Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parts.map((p, i) => (
                  <div key={i} className="p-4 border rounded-xl bg-gray-50 hover:bg-white transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800">{p.part}: {p.subject}</h3>
                        <p className="text-sm text-gray-500">{p.time}</p>
                      </div>
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
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Syllabus */}
        <TabsContent value="syllabus">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid md:grid-cols-2 gap-6">
            {Object.entries(syllabus).map(([subject, topics]) => (
              <Card key={subject} className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-600 font-semibold">
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

        {/* Criteria */}
        <TabsContent value="criteria">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 font-semibold">
                  <Award className="w-5 h-5" /> Qualifying Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                  <li>Zero or negative marks in Mathematics OR overall = Disqualified</li>
                  <li>Ranking based on total weighted marks (max 1000)</li>
                  <li><b>Tie-breakers:</b> Maths → Reasoning → Computer → Age → Random</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Institutes */}
        <TabsContent value="institutes">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid md:grid-cols-2 gap-6">
            {institutes.map((inst, i) => (
              <Card key={i} className="bg-white/80 border border-gray-100 backdrop-blur-md rounded-3xl p-4 hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-600 font-semibold">
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

export default Nimcet2025;
