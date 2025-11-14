import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BASE_URL } from "@/config";

const HeroSection = () => {
  const [currentExam, setCurrentExam] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    center: "",
    subject: "",
  });

  const [loading, setLoading] = useState(false);

  const exams = [
    "NIMCET",
    "CUET-PG MCA",
    "MAH-CET MCA",
    "JMI MCA",
    "BIT MCA",
    "VIT MCA",
    "DU MCA",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExam((prev) => (prev + 1) % exams.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/mail/send-counselling-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Network error");

      toast.success("Message sent Successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        center: "",
        subject: "",
      });
    } catch {
      toast.error("❌ Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  /* PRE-GENERATED BALLOONS */
  const balloons = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 90,
      size: 35 + Math.random() * 25,
      startY: 100 + Math.random() * 60,
      delay: Math.random() * 2,
      duration: 6 + Math.random() * 4,
      color: ["#ff6b6b", "#4dabf7", "#fcc419", "#9775fa"][i % 4],
    }));
  }, []);

  return (
    <div className="relative">
      {/* ============================= */}
      {/*        HERO MAIN SECTION      */}
      {/* ============================= */}
      <section className="relative py-16 sm:py-24 text-center overflow-hidden hero-festival-gradient z-10">

        {/* DISCO SHIMMER */}
        <div className="disco-shimmer z-20"></div>

        {/* GLOW AURA */}
        <div className="glow-aura">
          <div className="absolute top-10 left-10 w-80 h-80 bg-pink-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-400 rounded-full"></div>
          <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-yellow-400 rounded-full"></div>
        </div>

        {/* CONFETTI */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
                "--clr": ["#ff6b6b", "#4dabf7", "#fcc419", "#9775fa"][i % 4],
              }}
            ></div>
          ))}
        </div>

        {/* FIREWORKS */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="firework"
              style={{
                top: `${20 + Math.random() * 40}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 1.4}s`,
                backgroundColor: ["#fff", "#ffd43b", "#ff8787", "#a5d8ff"][i % 4],
              }}
            ></div>
          ))}
        </div>

        {/* FLOATING BALLOONS */}
        <div className="absolute inset-0 pointer-events-none select-none z-40 overflow-hidden">
          {balloons.map((b) => (
            <motion.div
              key={b.id}
              className="balloon absolute"
              style={{
                left: `${b.left}%`,
                width: b.size,
                height: b.size * 1.35,
                backgroundColor: b.color,
              }}
              initial={{ y: `${b.startY}vh`, opacity: 0, scale: 0.9 }}
              animate={{ y: "-20vh", opacity: [0, 1, 1, 0], scale: 1 }}
              transition={{
                duration: b.duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: b.delay,
              }}
            />
          ))}
        </div>

        {/* ==== HERO CONTENT ==== */}
        <div className="relative z-50 max-w-7xl mx-auto px-4 pb-6">

          {/* ONE-DAY BANNER */}
          <div className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-3 shadow-lg animate-pulse rounded-lg mb-6">
            <p className="text-center text-lg font-bold tracking-wide">
              🎉 ACME Academy Foundation Day • Happy Children’s Day 🎈
            </p>
          </div>

          {/* BADGE + HEADING */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="glass px-4 py-2 text-sm animate-bounce-in">
                🎯 India's Most Trusted{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  <span className="font-extrabold text-red-600">M</span>
                  <span className="font-semibold">C</span>A{" "}
                  <span className="font-extrabold text-red-600">E</span>
                  <span className="font-semibold">ntrance </span>
                  <span className="font-extrabold text-red-600">Ac</span>
                  <span className="font-semibold">ademy</span>
                </span>
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 animate-fade-in-up">
              <span className="text-white">Your Gateway to</span>
              <br />
              <span className="text-gray-700 text-7xl font-bold">MCA Success</span>
            </h1>

            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex justify-center items-center space-x-2">
                <span className="text-white/80">Currently preparing for:</span>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-white font-semibold text-lg animate-pulse">
                    {exams[currentExam]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WAVY BOTTOM */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-50">
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
      </section>

      {/* FORM SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-6xl mx-auto px-6 py-10 bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl -mt-30 z-20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Book a Free Counselling Now...
          </h2>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-lg rounded-2xl pt-6">
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Email (optional)</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Preferred Center</Label>
                    <Select onValueChange={(v) => handleInputChange("center", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select center" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raipur">Raipur</SelectItem>
                        <SelectItem value="kanpur">Kanpur</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Query Type</Label>
                  <Select onValueChange={(v) => handleInputChange("subject", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select query type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="counselling">Free Counselling</SelectItem>
                      <SelectItem value="course">Course Inquiry</SelectItem>
                      <SelectItem value="admission">Admission</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 text-white px-6 py-2 rounded-full shadow-md"
                  >
                    {loading ? "Sending..." : <Send className="h-4 w-4" />}
                    {!loading && "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <img
              src="https://res.cloudinary.com/dwqvrtvu1/image/upload/v1762278134/mobileapp01.jpg_g3lhyt.webp"
              alt="Acme Academy"
              className="w-[90%] max-w-md rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
