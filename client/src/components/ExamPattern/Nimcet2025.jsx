import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, Users, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

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
    <div className="min-h-screen pt-6">
      {/* Page Header */}
      <section className="py-16 hero-gradient text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          NIMCET <span className="gradient-text"></span>
        </h1>
        <p className="text-lg text-white/90 max-w-3xl mx-auto">
          National Institute of Technology MCA Common Entrance Test 2025 – Exam Pattern,
          Marking Scheme, Syllabus & Participating Institutes
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
                <CardTitle className='gradient-hero'>Exam Structure & Marking Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parts.map((p, i) => (
                  <div key={i} className="p-4 border rounded-lg hover-glow">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{p.part}: {p.subject}</h3>
                        <p className="text-sm text-muted-foreground">{p.time}</p>
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
                  • Questions will appear one section after the other. Switching not allowed.<br />
                  • All questions in English only.<br />
                  • Each wrong answer: 25% negative marking.<br />
                  • Multiple responses: negative marking applied.
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
                      {topics.map((t, j) => <li key={j}>{t}</li>)}
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
                <CardTitle className='gradient-hero'>Qualifying & Ranking Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Zero or negative marks in Mathematics OR in total = Disqualified.</li>
                  <li>Ranking based on total weighted marks (max 1000).</li>
                  <li><b>Tie-breakers:</b></li>
                  <ul className="list-decimal pl-6 space-y-1">
                    <li>Higher marks in Mathematics</li>
                    <li>If equal → Higher marks in Reasoning</li>
                    <li>If equal → Higher marks in Computer Awareness</li>
                    <li>If equal → Older candidate gets preference</li>
                    <li>If still equal → Random sampling by computer</li>
                  </ul>
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
                    <CardTitle className='gradient-hero'>{inst.name}</CardTitle>
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

export default Nimcet2025;
