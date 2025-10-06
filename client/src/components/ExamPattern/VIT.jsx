import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

const VIT = () => { 
  const [selectedTab, setSelectedTab] = useState("overview");

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
      "Algorithms: Analysis, Asymptotic notation, Time & Space complexity, Worst/Average case, Greedy, Dynamic programming, Divide and conquer",
      "Data Structures: Arrays, Stacks, Queues, Linked Lists, Trees, Graphs, Traversals, Sorting & Searching techniques",
      "Computer Networks: Network models, Internet, OSI model, Physical/Data Link/Network/Presentation Layers, Transmission, Coding, Error detection & correction",
      "Programming in C: Data types, Expressions, Statements, Operators, Control structures (loops, if-else, switch), Storage classes, Functions, Recursion",
      "DBMS: Architecture, Data models, E-R Model, Normalization, Relational Model, Constraints, SQL, Query processing",
      "Operating Systems: Process management, CPU Scheduling, Synchronization, Deadlock, Memory management, Virtual memory, File structures, I/O Devices",
      "Computer Architecture: Boolean algebra, Arithmetic, Flip-flops, Combinational & sequential circuits, Instruction formats, Addressing modes, Memory types & organization, Interrupts, Von Neumann Architecture, Instruction cycle, Assembly Language"
    ],

    "English Communication": [
      "Grammar: Subject-Verb Agreement, Tense forms, Voices, Articles, Prepositions, Conjunctions",
      "Writing Technical Instructions, Memos & Minutes",
      "Transcoding, Preparing Questionnaires, Proof Reading",
      "General Vocabulary: Commonly confused words"
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
    "Candidates should have graduated with a full-time degree from any recognized University/Institute with a minimum aggregate of 60% or First class for MCA degree programme.",
    "Consistent record in X and XII Std is required.",
    "Candidates appearing for their final degree exam / final semester exam in the current year are also eligible to apply.",
    "Candidates should have completed their final Semester/year exams before the selection counselling at VIT.",
    "Recognized Bachelor’s Degree of minimum three years duration in B.Sc(CS)/BCA/BSc(IT) with 60% (as well as in class 10th & 12th) or 1st class in qualifying examination with Mathematics as one of the subjects at graduate level / 10+2 level.",
    "Other equivalent degrees with 60% or 1st class approved and recognized by authorities, with Computer Science and Mathematics as major subjects. Equivalence certificate required for double/triple major degrees."
  ];

  

  return (
    <div className="min-h-screen pt-6">
      {/* Page Header */}
      <section className="py-16 hero-gradient text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          VITMEE MCA Entrance <span className="gradient-text"></span>
        </h1>
        <p className="text-lg text-white/90 max-w-3xl mx-auto">
          VIT MCA Entrance Exam 2025 – Exam Pattern, Syllabus, Eligibility & Programs Offered
        </p>
      </section>

      {/* Tabs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="flex flex-wrap gap-4 mb-8 justify-center">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
  <TabsTrigger value="criteria">Eligibility</TabsTrigger>
  <TabsTrigger value="institutes">Institutes</TabsTrigger>

</TabsList>


          {/* Overview */}
          <TabsContent value="overview">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="gradient-hero">Exam Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parts.map((p, i) => (
                  <div key={i} className="p-4 border rounded-lg hover-glow">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{p.part}: {p.subject}</h3>
                      </div>
                      <div className="flex gap-6 mt-3 md:mt-0">
                        <Badge>{p.questions}</Badge>
                        <Badge>{p.marks}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="mt-4 text-sm text-muted-foreground">
                  • Questions are Multiple-Choice.<br />
                  • Approximate Weightage: Mathematics 40%, Computer Science 40%, English 20%.<br />
                  • Duration: 2 hours.<br />
                  • Marks: As per VITMEE guidelines; negative marking if applicable.
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

          {/* Eligibility */}
          <TabsContent value="criteria">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="gradient-hero">Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {eligibility.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutes */}
          <TabsContent value="institutes">
            <div className="grid md:grid-cols-1 gap-6">
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

export default VIT;
