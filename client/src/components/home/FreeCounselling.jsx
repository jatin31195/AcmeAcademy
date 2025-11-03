import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/config";
const FreeCounsellingSection = () => {
const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  center: "",
  subject: "",
});
const [loading, setLoading] = useState(false);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(`${BASE_URL}http://localhost:5000/api/mail/send-counselling-mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) throw new Error("Network response not ok");
    const data = await res.json();
    // console.log(data);

    // alert("✅ Message sent successfully!");
    setForm({ name: "", email: "", phone: "", center: "", subject: "", message: "" });
  } catch (err) {
    console.error("❌ Error:", err);
    // alert("Failed to send. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  
  const notices = [
    {
      id: 1,
      title: "Complete Direction & Distance in Just 30 Minutes",
      link: "https://www.youtube.com/watch?v=KBcuz4T1X5Y",
      date: "Dec 21, 2023",
    },
    {
      id: 2,
      title: "Set Theory NIMCET PYQs 2008–2022 - Short Tricks",
      link: "https://www.youtube.com/watch?v=VC3SzEwXq5I",
      date: "Dec 21, 2023",
    },
    {
      id: 3,
      title: "Free Computer Course | Lecture 01 | NIMCET & CUET",
      link: "https://www.youtube.com/watch?v=Fn6ngxNn3ds",
      date: "Dec 21, 2023",
    },
    {
      id: 4,
      title: "Mock Test Series Schedule Released",
      link: "#",
      date: "Jan 5, 2024",
    },
  ];

  const marqueeRef = useRef(null);
  useEffect(() => {
    const marquee = marqueeRef.current;
    let scrollAmount = 0;
    const speed = 0.4;
    const scrollMarquee = () => {
      if (marquee) {
        scrollAmount += speed;
        if (scrollAmount >= marquee.scrollHeight / 2) scrollAmount = 0;
        marquee.scrollTop = scrollAmount;
        requestAnimationFrame(scrollMarquee);
      }
    };
    scrollMarquee();
  }, []);

  return (
    <section className="py-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-6 items-stretch">
        
        {/* 🌟 FREE COUNSELLING FORM */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-white/90 via-indigo-50/70 to-blue-50/60 border border-blue-200 rounded-2xl shadow-md h-full flex flex-col">
            <CardHeader className="pb-2 text-center border-b border-blue-100/70">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Free Counselling
              </CardTitle>
              <p className="text-semibold text-sm text-gray-600 mt-1">
                Fill out the form and our experts will reach out soon!
              </p>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto pt-4">
  <form onSubmit={handleSubmit} className="space-y-5">
    {/* Name & Email */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email (optional)
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
    </div>

    {/* Phone & Preferred Center */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          placeholder="Your phone number"
          value={form.phone}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="center" className="text-sm font-medium text-gray-700">
          Preferred Center
        </label>
        <select
          id="center"
          name="center"
          value={form.center}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select center</option>
          <option value="raipur">Raipur</option>
          <option value="kanpur">Kanpur</option>
          <option value="online">Online</option>
        </select>
      </div>
    </div>

    {/* Query Type */}
    <div>
      <label htmlFor="subject" className="text-sm font-medium text-gray-700">
        Query Type
      </label>
      <select
        id="subject"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="">Select query type</option>
        <option value="counselling">Free Counselling</option>
        <option value="course">Course Inquiry</option>
        <option value="admission">Admission</option>
        <option value="feedback">Feedback</option>
        <option value="suggestion">Suggestion</option>
        <option value="other">Other</option>
      </select>
    </div>

    

    {/* Submit */}
    <div className="flex justify-center pt-1">
      <Button
        type="submit"
        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 text-white rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all flex items-center justify-center gap-2 px-6 py-2"
      >
        <Send className="h-4 w-4" />
        Send Message
      </Button>
    </div>
  </form>
</CardContent>

          </Card>
        </motion.div>

        {/* 💡 WHY FREE COUNSELLING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=" rounded-2xl  flex flex-col justify-center text-center h-full"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-indigo-600 w-3 h-3" />
            <h3 className="text-xl font-semibold text-gray-800">
              Why Free Counselling?
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm font-medium italic px-3">
            “Every student deserves clarity and direction.  
            Our counselling helps you build a strategy that fits your strengths —  
            plan smarter, study better, and achieve your MCA dream confidently.”
          </p>
        </motion.div>

        {/* 🔔 NOTICE BOARD */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 via-indigo-50/70 to-blue-50/60 border border-blue-200 shadow-md rounded-2xl h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-blue-100/70 text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-lg font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <Bell className="h-5 w-5 text-indigo-600" />
                Notice Board
              </CardTitle>
            </CardHeader>

            <CardContent className="relative px-4 py-3 flex-1 overflow-hidden">
              <div ref={marqueeRef} className="h-100 overflow-hidden">
                <div className="space-y-2">
                  {notices.concat(notices).map((notice, i) => (
                    <motion.a
                      key={i}
                      href={notice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white/80 border border-gray-200/60 backdrop-blur-md p-3 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-400/60 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <h5 className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {notice.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                    </motion.a>
                  ))}
                </div>
              </div>
            </CardContent>

            
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeCounsellingSection;
