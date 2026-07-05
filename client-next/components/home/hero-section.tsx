"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BASE_URL } from "@/lib/config";

// Ported from client/src/components/home/HeroSection.jsx. Form state,
// rotating-exam interval, and fetch/toast make this fully Client. The large
// commented-out festival/confetti/balloon experiment block in the original
// is dead code (never rendered) — omitted here since it has zero effect on
// output either way, not a behavior change.
const exams = ["NIMCET", "CUET-PG MCA", "MAH-CET MCA", "JMI MCA", "BIT MCA", "VIT MCA", "DU MCA"];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExam((prev) => (prev + 1) % exams.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="relative">
      <section className="relative py-16 sm:py-24 text-center overflow-hidden hero-gradient z-10">
        <div className="relative z-50 max-w-7xl mx-auto px-4 pb-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="glass px-4 py-2 text-sm animate-bounce-in">
                🎯 India&apos;s Most Trusted{" "}
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
                  <span className="text-white font-semibold text-lg animate-pulse">{exams[currentExam]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-50">
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
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
          <h2 className="text-3xl font-bold text-gray-800">Book a Free Counselling Now...</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-lg rounded-2xl pt-6">
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                  </div>

                  <div>
                    <Label>Email (optional)</Label>
                    <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
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
            {/* Plain <img>, not next/image: real intrinsic dimensions of this
                external Cloudinary asset aren't known, and next/image requires
                width/height that match the real aspect ratio or the image
                distorts — guessing would risk a visual regression. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dwqvrtvu1/image/upload/f_auto,q_auto/v1762278134/mobileapp01.jpg_g3lhyt.webp"
              alt="ACME Academy student dashboard — NIMCET & MCA entrance exam prep app"
              fetchPriority="high"
              className="w-[90%] max-w-md rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
