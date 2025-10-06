import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

const Mahcet = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Exam structure / marking scheme
  const parts = [
    { subject: "Mathematics & Statistics", questions: 30, marks: 60, correct: "+2", wrong: "No negative" },
    { subject: "Logical / Abstract Reasoning", questions: 30, marks: 60, correct: "+2", wrong: "No negative" },
    { subject: "English Comprehension & Verbal Ability", questions: 20, marks: 40, correct: "+2", wrong: "No negative" },
    { subject: "Computer Concepts", questions: 20, marks: 40, correct: "+2", wrong: "No negative" },
  ];

  // Syllabus
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
    <div className="min-h-screen pt-6">
      {/* Page Header */}
      <section className="py-16 hero-gradient text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          MAH-MCA-CET <span className="gradient-text"></span>
        </h1>
        <p className="text-lg text-white/90 max-w-3xl mx-auto">
          Maharashtra MCA Common Entrance Test 2024 – Exam Pattern, Marking Scheme, Syllabus & Participating Institutes
        </p>
      </section>

      {/* Tabs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="criteria">Qualifying Criteria</TabsTrigger>
            <TabsTrigger value="institutes">Participating Institutes</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="gradient-hero">Exam Structure & Marking Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parts.map((p, i) => (
                  <div key={i} className="p-4 border rounded-lg hover-glow">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{p.subject}</h3>
                      </div>
                      <div className="flex gap-6 mt-3 md:mt-0">
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
                <p className="mt-4 text-sm text-muted-foreground">
                  • 200 Marks total (100 Questions). <br />
                  • No negative marking. <br />
                  • Composite time of 90 minutes. <br />
                  • Online Computer-Based Test (CBT). <br />
                  • Medium: English only.
                </p>
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
                      {topics.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Criteria */}
          <TabsContent value="criteria">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="gradient-hero">Qualifying & Ranking Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>No negative marking. Every correct answer = +2 marks.</li>
                  <li>Ranking based on total score out of 200.</li>
                  <li>Candidates securing higher marks in total will get preference in ranking.</li>
                  <li>In case of ties, resolution is done by CET Cell rules (usually based on Mathematics & Logical Reasoning scores, then age).</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutes */}
          <TabsContent value="institutes">
            <div className="grid md:grid-cols-2 gap-6">
              {institutes.map((inst, i) => (
                <Card key={i} className="glass">
                  <CardHeader>
                    <CardTitle className="gradient-hero">{inst.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{inst.contact}</p>
                    <p className="text-sm text-muted-foreground">{inst.email}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Mahcet;
