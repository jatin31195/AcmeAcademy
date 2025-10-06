import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

const Cuetpg= () => { 
  const [selectedTab, setSelectedTab] = useState("overview");

  // Exam Overview (Structure & Scheme)
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
    <div className="min-h-screen pt-6">
      {/* Page Header */}
      <section className="py-16 hero-gradient text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          CUET PG MCA <span className="gradient-text"></span>
        </h1>
        <p className="text-lg text-white/90 max-w-3xl mx-auto">
          Common University Entrance Test for MCA (SCQP09) – Exam Pattern, Marking Scheme & Syllabus
        </p>
      </section>

      {/* Tabs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="criteria">Marking Scheme</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="gradient-hero">Exam Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(overview).map(([k, v], i) => (
                  <div key={i} className="p-3 border rounded-lg hover-glow">
                    <span className="font-semibold capitalize">{k.replace(/([A-Z])/g," $1")}:</span> {v}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syllabus */}
          <TabsContent value="syllabus">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(syllabus).map(([sub, topics], i) => (
                <Card key={i} className="glass">
                  <CardHeader>
                    <CardTitle className="flex gradient-hero items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      {sub}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {topics.map((t, j) => <li key={j}>{t}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marking Scheme */}
          <TabsContent value="criteria">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="gradient-hero">Marking & Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
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