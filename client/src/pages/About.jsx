import { useEffect } from "react";
import { Users, Award, BookOpen, Target, Heart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import KP from "../assets/images/kartikey-pandey.png";
import AK from "../assets/images/aman-khan.png";
import SM from "../assets/images/satish-sir-image.png";
import PP from "../assets/images/pritesh-pandey.png";
import SK from "../assets/images/sohail-sir.jpg"
const GradientIcon = ({ Icon, className = "" }) => (
  <Icon
    className={`mx-auto mb-4 ${className}`}
    stroke="url(#gradient-hero)"
    strokeWidth={2}
  />
);

const About = () => {
  const achievements = [
    { icon: Users, label: "Students Selected", value: "1000+" },
    { icon: Award, label: "Success Rate", value: "95%" },
    { icon: BookOpen, label: "Exams Covered", value: "NIMCET, CUET, JMI & more" },
    { icon: Target, label: "Years Experience", value: "10+" },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Vision",
      description:
        "To create highly competent MCA professionals by imparting quality education, instilling integrity, and nurturing confidence.",
    },
    {
      icon: Heart,
      title: "Care",
      description: "Every student is important to us. We provide personalized attention and care.",
    },
    {
      icon: Target,
      title: "Mission",
      description:
        "To provide real exam-level guidance, transform average students into achievers, and ensure consistent results through practice and perseverance.",
    },
  ];

  const milestones = [
    {
      year: "2015",
      event: "Academy Founded",
      description: "Started under the guidance of Kartikey Pandey (NIT Raipur, Ph.D. Scholar)",
    },
    {
      year: "2018",
      event: "Nationwide Reach",
      description: "Became preferred choice for MCA aspirants across India",
    },
    {
      year: "2022",
      event: "1000+ Selections",
      description:
        "Students selected in NITs, DU, JNU, BHU, JMI, HCU, IET Lucknow & more",
    },
  ];

  const faculty = [
    {
      name: "Mr. Kartikey Pandey",
      designation: "Director & Mathematics Mentor",
      qualification: "MCA (NIT Raipur), Ph.D. Scholar",
      experience: "10+ Years",
      specialization: "Mathematics & Reasoning",
      image: KP,
    },
    {
      name: "Mr. Aman Khan",
      designation: "Computer Fundamentals Mentor",
      qualification: "MCA (NIT Raipur), Ph.D. Scholar",
      specialization: "Computer Science & Programming",
      image: AK,
    },
    {
      name: "Mr. Satish Mishra",
      designation: "English Mentor",
      qualification: "Retd. Group Captain, Indian Air Force",
      specialization: "English & Communication",
      image: SM,
    },
    {
      name: "Mr. Pritesh Pandey",
      designation: "Logical Reasoning Mentor",
      qualification: "B.E., 5+ Years Teaching Experience",
      specialization: "Reasoning & Problem Solving",
      image: PP,
    },
    {
      name: "Mr. Sohail Sir",
      designation: "Reasoning & Quantitative Aptitude Mentor",
      qualification: "SSC CGL Qualified, 8+ Years Teaching Experience",
      specialization: "Reasoning & Problem Solving",
      image: SK,
    },
  ];

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show"); // Remove when leaving viewport
        }
      });
    },
    { threshold: 0.2 } // Trigger when 20% visible
  );

  document.querySelectorAll(".scroll-slide").forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* SVG Gradient for icons */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient-hero" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0072CE" />
            <stop offset="100%" stopColor="#66CCFF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero Section */}
      <section className="relative py-30 hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-3xl transform rotate-45 scale-150"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-6 animate-fade-in">
            About <span className="block text-gray-800">ACME Academy</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 animate-fade-in delay-200">
            India’s Most Trusted MCA Entrance Academy – empowering aspirants with quality education, expert mentors, and proven results.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-10 py-4 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-500"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((ach, idx) => (
              <Card
                key={idx}
                className="glass p-8 text-center shadow-xl hover:scale-105 hover-glow transition-all duration-500"
              >
                <GradientIcon Icon={ach.icon} className="h-12 w-12 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{ach.value}</h3>
                <p className="text-gray-500">{ach.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Core Values
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-16">
            {values.map((value, idx) => (
              <Card
                key={idx}
                className="glass p-6 hover:scale-105 hover-glow transition-all duration-500"
              >
                <CardHeader className="text-center">
                  <GradientIcon Icon={value.icon} className="h-14 w-14 mb-4" />
                  <CardTitle className="text-2xl text-black font-bold text-center">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Journey
            </span>
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse-slow"></div>
            <div className="space-y-12">
              {milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className={`flex items-center ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <Card
                    className={`glass max-w-md p-6 shadow-xl scroll-slide ${
                      idx % 2 === 0 ? "left" : "right"
                    }`}
                    style={{ transitionDelay: `${idx * 200}ms` }}
                  >
                    <Badge variant="outline" className="mb-4 border-blue-300">{ms.year}</Badge>
                    <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">{ms.event}</CardTitle>
                    <CardContent>
                      <p className="text-gray-600">{ms.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Experts
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {faculty.map((fac, idx) => (
              <Card
                key={idx}
                className="glass p-8 text-center shadow-2xl hover:scale-105 hover-glow transition-all duration-500"
              >
                <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden border-4 border-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-lg">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-xl mb-2">{fac.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{fac.designation}</p>
                <p className="text-gray-500 text-sm mb-2">{fac.qualification}</p>
                {fac.experience && (
                  <Badge variant="secondary" className="mb-2">{fac.experience}</Badge>
                )}
                <p className="text-gray-500 text-sm">{fac.specialization}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="glass p-10 shadow-xl hover:scale-105 transition-all duration-500">
            <CardContent>
              <h3 className="text-3xl font-bold mb-6">
                Join Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Success Story
                </span>
              </h3>
              <p className="text-gray-600 mb-8">
                Become part of ACME Academy’s legacy of excellence and achieve your MCA dreams with proven methodology and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-10 py-4 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-500"
                >
                  Start Your Journey
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-400 text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all duration-500"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
