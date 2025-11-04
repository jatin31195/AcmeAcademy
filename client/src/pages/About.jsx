import { useEffect } from "react";
import {
  Users,
  Award,
  BookOpen,
  Target,
  Heart,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import KP from "../assets/images/kartikey-pandey.png";
import AK from "../assets/images/aman-khan.png";
import SM from "../assets/images/satish-sir-image.png";
import PP from "../assets/images/pritesh-pandey.png";
import SK from "../assets/images/sohail-sir.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const GradientIcon = ({ Icon, className = "" }) => (
  <Icon
    className={`mx-auto mb-3 ${className}`}
    stroke="url(#purple-red-gradient)"
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
        "To create highly competent MCA professionals by imparting quality education and confidence.",
    },
    {
      icon: Heart,
      title: "Care",
      description:
        "Every student is important. We provide personalized attention and care.",
    },
    {
      icon: Target,
      title: "Mission",
      description:
        "To transform average students into achievers with real exam-level guidance.",
    },
  ];

const milestones = [
  {
    year: "2015",
    title: "The Beginning of a Legacy",
    highlight: "ACME Academy Founded",
    description:
      "Established under Dr. Kartikey Pandey (NIT Raipur, Ph.D.), ACME began its mission to guide MCA aspirants toward premier institutes across India.",
  },
  {
    year: "2018",
    title: "Chhattisgarh’s No.1 Academy",
    highlight: "Regional Excellence Achieved",
    description:
      "ACME became the most trusted MCA Entrance Academy in Chhattisgarh with record selections and exceptional teaching standards.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    highlight: "Learning Never Stopped",
    description:
      "During COVID, ACME launched its Mobile App, ensuring uninterrupted classes and nationwide learning from home.",
  },
  {
    year: "2021",
    title: "Nationwide Recognition",
    highlight: "Trusted by Students Across India",
    description:
      "Learners from every corner of India joined ACME’s programs, making it a leading national name in MCA preparation.",
  },
  {
    year: "2023",
    title: "Expansion to Lucknow",
    highlight: "Offline Growth",
    description:
      "With growing demand, ACME opened its new offline center in Lucknow, bringing top mentorship to North India.",
  },
  {
    year: "2025",
    title: "Historic Achievements",
    highlight: "Top All India Ranks",
    description:
      "Students secured NIMCET AIR-4, 8, 10 and CUET AIR-2, 7, 9. The Lucknow center moved to Kanpur, expanding our excellence further.",
  },
  {
    year: "Beyond 2025",
    title: "The Journey Continues…",
    highlight: "Transforming Aspirations into Achievements",
    description:
      "With 2000+ selections in NITs, DU, JNU, BHU, JMI & HCU — ACME continues to build NITians with trust, quality, and results.",
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
          entry.target.classList.toggle("show", entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".scroll-slide").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
    
      <svg width="0" height="0">
  <defs>
    <linearGradient id="purple-red-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
 
      <stop offset="100%" stopColor="#EF4444" /> {/* Red */}
    </linearGradient>
  </defs>
</svg>


  
      <section className="relative py-16 sm:py-26 text-center overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-3xl rotate-45 scale-150"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
              About
            </span>{" "}
            <span className="text-white">Acme Academy</span>
          </motion.h1>
          <p className="font-semibold text-lg sm:text-xl text-white/90 mb-8">
            India’s Most Trusted MCA Entrance Academy 
            <br/>
            empowering aspirants with
            quality education and proven results.
          </p>
          
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
      </section>
  
<section className="relative py-20 bg-gradient-to-b from-white via-gray-50 to-purple-50 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-300/10 to-red-400/10 blur-3xl"></div>

  <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
    
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-700"></div>
        <img
          src={KP}
          alt="Kartikey Pandey"
          className="relative w-72 sm:w-80 md:w-96 rounded-2xl shadow-2xl object-cover border-4 border-white"
        />
      </div>
    </motion.div>

 
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-transparent bg-clip-text">
          Person Behind Excellence
        </span>
      </h2>

      <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
        <strong>ACME Academy</strong>, established in <strong>2015</strong> under the adept guidance of{" "}
        <strong>Kartikey Pandey</strong> — a dedicated Ph.D. scholar and <strong>NIT Raipur</strong> alumnus —
        has been at the forefront of <strong>MCA Entrance Exam</strong> preparation in India.
      </p>

      <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
        Known for his vision, discipline, and mentoring excellence, he’s not just the <strong>Director</strong> of the
        institution but the <strong>soul</strong> of ACME Academy. His leadership inspires innovation,
        hard work, and success — creating a legacy of over <strong>1000+ selections</strong> in premier institutions like
        <strong> NITs, DU, JNU, BHU, JMI, HCU</strong> and more.
      </p>

      <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
        His philosophy, <em>“We deliver what we promise,”</em> drives every aspect of ACME’s journey.
        Through up-to-date study materials, rigorous guidance, and personalized mentorship,
        he ensures every student achieves their highest potential.
      </p>

   
<div className="flex flex-wrap gap-4 mt-6">
  <Link to="/acme-academy-results">
    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
      Know More About ACME
    </Button>
  </Link>

  <Button
    variant="outline"
    className="border-gray-400 text-gray-700 hover:text-purple-600 hover:border-purple-400"
  >
    Meet Our Faculty
  </Button>
</div>
    </motion.div>
  </div>
</section>
 
<section className="relative py-20 bg-gradient-to-b from-purple-50 via-gray-50 to-white">
  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-400/10 to-red-400/10 blur-2xl"></div>
  <div className="relative z-10 max-w-7xl mx-auto px-6">
    <motion.h2
      initial={{ opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-3xl sm:text-4xl font-extrabold text-center mb-14 font-[Poppins]"
    >
      <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-transparent bg-clip-text">
        Our Vision & Mission
      </span>
    </motion.h2>

    <div className="grid md:grid-cols-2 gap-8">
   
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-xl border border-gray-200 px-10 py-8 
                   rounded-3xl shadow-lg hover:shadow-2xl transition-all 
                   md:min-h-[280px] flex flex-col justify-center"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-purple-700 font-[Poppins]">
          Our Vision
        </h3>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg font-[Inter] tracking-wide">
          ACME Academy strives to be a pioneer of excellence in MCA Entrance coaching,
          nurturing disciplined, confident, and skilled aspirants ready to lead the
          technology-driven world.
        </p>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg mt-3 font-[Inter] tracking-wide">
          We believe <strong>“Success is not just an outcome, but a journey of consistent growth.”</strong>
        </p>
      </motion.div>

    
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-xl border border-gray-200 px-10 py-8 
                   rounded-3xl shadow-lg hover:shadow-2xl transition-all 
                   md:min-h-[280px] flex flex-col justify-center"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-pink-700 font-[Poppins]">
          Our Mission
        </h3>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg font-[Inter] tracking-wide">
          To deliver <strong>100% success</strong> through real exam-level preparation,
          modern teaching strategies, and personal mentorship that transform every
          student into an achiever.
        </p>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg mt-3 font-[Inter] tracking-wide">
          Guided by the principle <em>“Practice and Patience Make a Man Perfect,”</em> we
          cultivate excellence through structured learning and continuous improvement.
        </p>
      </motion.div>
    </div>
  </div>
</section>


     
<section className="relative py-20 bg-gradient-to-b from-white via-purple-50 to-white overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100/40 via-purple-100/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>

  <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 mb-14"
    >
      Our Achievements
    </motion.h2>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
      {achievements.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="group bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <a.icon className="text-white w-7 h-7" />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800">{a.value}</h3>
          <p className="text-gray-600 mt-2 font-medium">{a.label}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


<section className="relative py-24 bg-gradient-to-r from-purple-50 via-white to-pink-50 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#c084fc33,_transparent_70%)]"></div>
  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl sm:text-5xl font-extrabold text-center mb-14 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
    >
      Our Core Values
    </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
      {values.map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative p-8 rounded-3xl bg-white/50 backdrop-blur-xl shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
            <v.icon className="text-white w-6 h-6" />
          </div>

          <h3 className="mt-10 text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            {v.title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            {v.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


    
<section className="relative py-20 bg-gradient-to-b from-white via-purple-50 to-pink-50 overflow-hidden">
  
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(196,181,253,0.3),_transparent_70%)] blur-3xl"></div>

  <div className="max-w-6xl mx-auto px-6 relative z-10">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-3xl sm:text-4xl font-bold text-center mb-14 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"
    >
      Our Journey – <span className="text-gray-800">A Decade of Excellence</span>
    </motion.h2>

    <div className="relative max-w-4xl mx-auto">
     
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>

      <div className="space-y-12">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative flex items-center ${
              i % 2 === 0 ? "justify-start" : "justify-end"
            } sm:gap-10`}
          >
      
            <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-purple-200"></div>

            
            <div
              className={`w-full sm:w-[46%] bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                i % 2 === 0 ? "text-left" : "text-right"
              }`}
            >
              <Badge
                variant="outline"
                className="border-purple-300 text-purple-700 mb-2 font-medium text-xs px-3 py-1"
              >
                {m.year}
              </Badge>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                {m.title}
              </h3>
              <p className="text-sm text-purple-700 font-medium mb-1 italic">
                {m.highlight}
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                {m.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

  
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="text-center mt-14 text-xs sm:text-sm text-gray-700 font-medium"
    >
      💫 <span className="font-semibold text-purple-700">ACME ACADEMY</span> — Transforming Aspirations into Achievements since{" "}
      <span className="text-pink-600 font-bold">2015</span>
    </motion.div>
  </div>
</section>



     
<section className="relative py-20 bg-gradient-to-b from-white via-purple-50 to-pink-50 overflow-hidden">
  
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(196,181,253,0.25),_transparent_70%)] blur-3xl"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-6">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl sm:text-5xl font-extrabold text-center mb-14 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
    >
      Our Experts
    </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {faculty.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-2 p-8 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-white overflow-hidden">
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            {f.name}
          </h3>
          <p className="text-purple-600 text-sm font-semibold">
            {f.designation}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            {f.qualification}
          </p>
          {f.experience && (
            <Badge
              variant="secondary"
              className="mt-2 mb-1 bg-purple-100 text-purple-700 border border-purple-300"
            >
              {f.experience}
            </Badge>
          )}
          <p className="text-gray-600 text-xs sm:text-sm mt-1 italic">
            {f.specialization}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


<section className="py-20 bg-gradient-to-b from-pink-50 via-white to-purple-50">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500"
    >
      <h3 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        Join Our Success Story
      </h3>
      <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
        Become a part of <span className="font-semibold text-purple-600">ACME Academy’s</span> legacy of excellence and achieve your MCA dreams with
        expert mentors guiding every step.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/contact-acme-academy">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition">
            Start Your Journey
          </Button>
        </Link>
        <Link to="/contact-acme-academy">
          <Button
            variant="outline"
            className="border-gray-400 text-gray-700 hover:text-purple-600 hover:border-purple-400 transition font-medium px-8 py-3 rounded-full"
          >
            Contact Us
          </Button>
        </Link>
      </div>
    </motion.div>
  </div>
</section>

    </div>
  );
};

export default About;
