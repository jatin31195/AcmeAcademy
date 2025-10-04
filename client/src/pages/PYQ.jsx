import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Calendar, Eye, Filter } from "lucide-react";

const PYQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const navigate = useNavigate();

  const pyqData = [
    {
      id: 1,
      exam: "NIMCET",
      year: "2024",
      title: "NIMCET 2024 Question Paper",
      description: "Complete question paper with answer key",
      pdfUrl: "https://your-cdn.com/nimcet2024.pdf",
      fileSize: "2.5 MB",
      difficulty: "Medium",
      questions: 120
    },
    {
      id: 2,
      exam: "CUET-PG",
      year: "2024",
      title: "CUET-PG MCA 2024 Question Paper",
      description: "Latest CUET-PG MCA question paper",
      pdfUrl: "https://your-cdn.com/cuetpg2024.pdf",
      fileSize: "3.1 MB",
      difficulty: "Hard",
      questions: 100
    }
  ];

  const exams = ["all", "NIMCET", "CUET-PG", "MAH-CET", "JMI MCA", "BIT MCA", "VIT MCA", "DU MCA"];
  const years = ["all", "2024", "2023", "2022", "2021", "2020"];

  const filteredPYQ = pyqData.filter(pyq => {
    const matchesSearch = pyq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pyq.exam.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === "all" || pyq.exam === selectedExam;
    const matchesYear = selectedYear === "all" || pyq.year === selectedYear;
    return matchesSearch && matchesExam && matchesYear;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Hard": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Previous Year <span className="gradient-text">Questions</span>
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search question papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto flex gap-4 justify-center">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam} value={exam}>
                  {exam === "all" ? "All Exams" : exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* PYQ Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPYQ.map((pyq) => (
            <Card
              key={pyq.id}
              onClick={() => navigate(`/pyq/${pyq.id}`)}
              className="glass hover-glow cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg gradient-text">{pyq.title}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {pyq.year}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{pyq.exam}</Badge>
                  <Badge className={getDifficultyColor(pyq.difficulty)}>{pyq.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{pyq.description}</p>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Questions:</span> {pyq.questions} |{" "}
                  <span className="font-medium">Size:</span> {pyq.fileSize}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPYQ.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No question papers found</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PYQ;
