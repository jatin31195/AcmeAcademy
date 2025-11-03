import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

const Cuetpg = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

   const overview = {
    conductingBody: "National Testing Agency (NTA)",
    mode: "Computer-Based Test (CBT)",
    language: "English and Hindi",
    duration: "90 Minutes",
    frequency: "Once a year",
    type: "Multiple Choice Questions (MCQs)",
    subjectCode: "SCQP09",
    totalQuestions: 75,
    sections: 1,
    basedOn: "Domain-Specific Questions",
    totalMarks: 300,
    negative: "Yes (–1 for incorrect)",
    marking: "+4 for correct, –1 for wrong, 0 for unattempted",
    website: "https://exams.nta.ac.in/CUET-PG/"
  };

  // Syllabus
  const syllabus = {
      Mathematics: [
        "Set Theory: Concept of sets – Union, Intersection, Cardinality, Elementary counting; permutations and combinations",
        "Probability and Statistics: Basic probability theory, Averages, Dependent/Independent events, Frequency distributions, Measures of central tendency & dispersions",
        "Algebra: Fundamental operations, Expansions, Factorization, Simultaneous linear/quadratic equations, Indices, Logarithms, Arithmetic/Geometric/Harmonic progressions, Determinants, Matrices",
        "Coordinate Geometry: Rectangular Cartesian coordinates, Distance formula, Equation of a line, Intersection of lines, Pair of straight lines, Circles, Parabola, Ellipse, Hyperbola",
        "Calculus: Limits, Continuous functions, Differentiation, Tangents & Normals, Maxima & Minima, Integration (by parts, substitution, partial fractions), Definite integrals & applications to areas"
      ],
  "Analytical Ability and Logical Reasoning": [
    "Patterns, trends and assessment of figures & diagrams",
    "Geometrical designs & Identification",
    "Selection of related letters / words / numbers / figures",
    "Identification of odd item out from a group",
    "Completion of numerical series based on pattern/logic",
    "Fill in the blanks of series based on numerical pattern & logic",
    "Syllogisms, Identification of logic & correct answers based on logic"
  ],


  Computer: [
    "Operating System: Functions, Processes, Threads, Interprocess communication, Concurrency, Synchronization, Deadlock, CPU/I-O/Resource scheduling, Deadlock algorithms (Banker’s), Memory management & Virtual memory, File systems, I/O systems, DOS, UNIX, Windows",
    "Data Structure: Arrays, Sparse Matrix, Stacks, Queues, Priority Queues, Linked Lists, Trees, Forest, Binary Trees, Threaded Binary Tree, BST, AVL Tree, B Tree, B+ Tree, B* Tree, Graphs, Hashing, Sorting & Searching Algorithms, Functions, Recursion, Parameter Passing",
    "Digital Fundamentals: Data types, Number systems & conversions, Complements, Fixed/Floating point representation, Error detection codes, Computer arithmetic (Add/Subtract/Multiply/Divide), Logic Gates, Boolean Algebra, K-Map simplification, Combinational & Sequential Circuits, Flip-Flops, ICs, Decoders, Multiplexers, Registers, Counters, Memory Units"
  ]
};


  return (
    <div className="space-y-10">
     
      {/* Tabs Section */}
      <section>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="flex flex-wrap justify-center bg-gray-50 border p-2 rounded-2xl shadow-sm mb-10">
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
              Marking Scheme
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <Card className="glass border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Exam Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(overview).map(([key, value], index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:bg-white">
                    <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}:</span> {value}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syllabus */}
          <TabsContent value="syllabus">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(syllabus).map(([subject, topics], i) => (
                <Card key={i} className="glass border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 bg-clip-text text-transparent">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      {subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {topics.map((topic, j) => (
                        <li key={j}>{topic}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marking Scheme */}
          <TabsContent value="criteria">
            <Card className="glass border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Marking & Scoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Total Questions: 75 (all domain-specific)</li>
                  <li>Total Marks: 300</li>
                  <li>+4 marks for each correct answer</li>
                  <li>-1 mark for each incorrect answer</li>
                  <li>No negative marking for unattempted questions</li>
                  <li>Exam duration: 90 minutes</li>
                  <li>Mode: CBT (Computer-Based Test)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Cuetpg;
