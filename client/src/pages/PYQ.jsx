import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Calendar } from "lucide-react";
import { BASE_URL } from "../config";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

const PYQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/pyqs/`);
        const data = await res.json();
        setPyqs(data);
      } catch (err) {
        console.error("Error fetching PYQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPYQs();
  }, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
          else entry.target.classList.remove("show");
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".scroll-slide").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const exams = ["all", "NIMCET", "CUET-PG", "MAH-CET", "JMI MCA", "BIT MCA", "VIT MCA", "DU MCA"];
  const years = ["all", "2024", "2023", "2022", "2021", "2020"];

  const filteredPYQ = pyqs.filter((pyq) => {
    const matchesSearch =
      pyq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.exam.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === "all" || pyq.exam === selectedExam;
    const matchesYear = selectedYear === "all" || pyq.year === selectedYear;
    return matchesSearch && matchesExam && matchesYear;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Hard":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  if (loading) return <div className="text-center py-20">Loading question papers...</div>;

  return (
    <>
    <SEO
  title="Previous Year MCA Entrance Question Papers | ACME Academy"
  description="Download and practice Previous Year Question Papers (PYQs) for NIMCET, CUET-PG, MAH-CET, JMI, BIT, and other MCA entrance exams. Prepare effectively with ACME Academy."
  url="https://www.acmeacademy.in/pyq"
  image="https://www.acmeacademy.in/assets/og-pyq.jpg"
  keywords="NIMCET PYQ, CUET-PG question papers, MAH-CET MCA papers, JMI MCA PYQs, BIT MCA papers, ACME Academy PYQs, previous year MCA papers"
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Previous Year MCA Entrance Question Papers",
    "description":
      "Browse and download PYQs from NIMCET, CUET-PG, MAH-CET, and other MCA entrance exams. Curated by ACME Academy.",
    "url": "https://www.acmeacademy.in/pyq",
    "numberOfItems": pyqs?.length || 0,
    "itemListElement": pyqs?.slice(0, 10).map((pyq, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://www.acmeacademy.in/pyq/${pyq._id}`,
      "name": `${pyq.exam} ${pyq.year} Question Paper`,
      "description": pyq.description || `${pyq.exam} ${pyq.year} MCA entrance PYQ`,
      "dateCreated": pyq.year ? `${pyq.year}-01-01` : undefined,
      "additionalType": "https://schema.org/Dataset",
      "inLanguage": "en",
      "publisher": {
        "@type": "Organization",
        "name": "ACME Academy",
        "url": "https://www.acmeacademy.in",
      },
    })),
  }}
/>

    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <section className="relative py-16 sm:py-34 text-center overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
              Previous
            </span>{" "}
            <span className="text-white">Year Questions</span>
          </motion.h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="text-white absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search question papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-semibold pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
               <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
              fill="white"
            />
          </svg>
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
              key={pyq._id} // Assuming MongoDB _id
              onClick={() => navigate(`/pyq/${pyq._id}`)}
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
    </>
  );
};

export default PYQ;
