import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

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
    <div className="min-h-screen pt-6">
      {/* Page Header */}
      <section className="py-16 hero-gradient text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          JMI MCA Entrance <span className="gradient-text"></span>
        </h1>
        <p className="text-lg text-white/90 max-w-3xl mx-auto">
          Jamia Millia Islamia – MCA Entrance Test Exam Pattern, Marking Scheme & Syllabus
        </p>
      </section>

      {/* Tabs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="criteria">Qualifying Criteria</TabsTrigger>
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
                  • Multiple-choice questions only.<br />
                  • Distribution approx.: 40% Maths, 40% Computer, 10% Reasoning, 10% English.<br />
                  • Exam duration: 2 hours.<br />
                  • Marking: As per university guidelines (usually +1 for correct, negative marking if notified).
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
                <CardTitle className="gradient-hero">Qualifying Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Selection is based on rank in entrance test.</li>
                  <li>Merit list prepared from total marks scored.</li>
                  <li>Negative marking policy (if applicable) is declared in the exam notice.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default JMI;
