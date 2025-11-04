import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Quote,
  Users2,
  BookOpen,
  Star,
  Users,
  HeartHandshake
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, useAnimation, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "@/config";
const Contact = () => {
   const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    center: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Form Input
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Submit Logic (Copied from HeroSection)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/mail/send-counselling-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      await res.json();
      toast.success("✅ Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        center: "",
        subject: "",
        
      });
    } catch (err) {
      toast.error("❌ Error sending message. Please try again!");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickContacts = [
    {
      icon: Phone,
      title: "Call Us",
      primary: "+91 8109977628",
      secondary: "+91 9516001679",
      action: "tel:+918109977628",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      primary: "Quick Support",
      secondary: "Instant Reply",
      action: "https://wa.me/918109977628",
    },
    {
      icon: Mail,
      title: "Email Us",
      primary: "info@acmeacademy.com",
      secondary: "support@acmeacademy.com",
      action: "mailto:info@acmeacademy.com",
    },
  ];

  const centers = [
    {
      name: "Kanpur Center",
      address:
        "Acme Academy (NIMCET MCA), Kanpur, Uttar Pradesh 208016",
      phone: "+91 9516001679",
      embedMap:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3315.294813610136!2d80.2888565749969!3d26.486887378261347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c39ce8b94d101%3A0x4607109ea35dcafa!2sAcme%20Academy%20(Nimcet%20MCA)%20Kanpur!5e1!3m2!1sen!2sin!4v1762111180447!5m2!1sen!2sin",
    },
    {
      name: "Raipur Center",
      address:
        "ACME Academy, Near Fafadih Chowk, Raipur, Chhattisgarh 492001",
      phone: "+91 8109977628",
      embedMap:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.083587021392!2d81.60093537484188!3d21.25668427991206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dde608f74bc9%3A0x55f3b56ccfe27475!2sACME%20ACADEMY!5e1!3m2!1sen!2sin!4v1762111208300!5m2!1sen!2sin",
    },
  ];
const stats = [
  { icon: Users, value: 100, label: "Students Counselled" },
  { icon: Star, value: 4.6, label: "Average Feedback " },
  { icon: HeartHandshake, value: 78, label: "Student Satisfaction (%)" },
];

const AnimatedStat = ({ icon: Icon, value, label, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (value - start) * progress;
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="space-y-3"
    >
      <Icon className="h-12 w-12 mx-auto text-pink-600 opacity-90" />
      <h3 className="text-4xl font-extrabold text-gray-800 tracking-tight">
      
        {value % 1 === 0
          ? Math.round(displayValue)
          : displayValue.toFixed(1)}
        +
      </h3>
      <p className="text-lg font-medium text-gray-600">{label}</p>
    </motion.div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50 text-gray-800">
      {/* ✅ SEO Metadata */}
      <Helmet>
        <title>Contact ACME Academy | Best MCA Coaching in India (Raipur & Kanpur)</title>
        <meta
          name="description"
          content="Get in touch with ACME Academy — India’s top NIMCET MCA coaching institute. Visit our Kanpur or Raipur centers for expert guidance on MCA entrance preparation."
        />
        <meta
          name="keywords"
          content="Best MCA Coaching in India, NIMCET Coaching, MCA Entrance Classes, ACME Academy Kanpur, ACME Academy Raipur, Online MCA Coaching, Top MCA Institute"
        />
      </Helmet>

      {/* 🌊 Hero Section */}
      <section className="relative py-16 sm:py-28 text-center overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl mx-auto px-6"
        >
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold mb-4 text-white drop-shadow-lg">
            Contact ACME Academy
          </h1>
          <p className="text-gray-800 text-lg sm:text-xl  max-w-3xl mx-auto">
            Have a question, need guidance, or want to start your <b>MCA journey</b>?  
            Reach out to us for <b>Free Counselling, Admission Queries, Feedback,</b> or <b>Suggestions.</b>
          </p>
        </motion.div>

        {/* Animated Wave */}
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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {quickContacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-xl border border-pink-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <contact.icon className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {contact.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {contact.primary}
                  </p>
                  <p className="text-xs text-gray-500">{contact.secondary}</p>
                  <Button
                    className="mt-5 w-full bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 text-white hover:scale-105 transition rounded-full"
                    onClick={() => window.open(contact.action, "_blank")}
                  >
                    Contact Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

     
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          >
            Free Counselling & Student Support
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-4xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            At <b>ACME Academy</b>, we believe every student deserves personalized guidance.  
            Whether you’re confused about <b>which course to choose</b>, want to know <b>exam preparation strategies</b>,  
            or need to share feedback/suggestions — our expert mentors are just a message away.  
            <b>Fill out the form below</b> to book your **Free Counselling Session** today.
          </motion.p>
        </div>
      </section>

      {/* 📨 Contact Form */}
      <section className="py-20 bg-gradient-to-b from-white via-pink-50 to-red-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/90 backdrop-blur-lg border border-pink-100 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-500">
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com (optional)"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="center">Preferred Center</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("center", value)
                        }
                      >
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
                    <Label htmlFor="subject">Query Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("subject", value)
                      }
                    >
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

                 

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-600 via-pink-400 to-red-400 text-white hover:scale-105 transition rounded-full flex items-center justify-center gap-2 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Sending..." : <Send className="mr-2 h-4 w-4" />}
                    {!loading && "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivation Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center text-center space-y-6"
          >
            <Quote className="h-12 w-12 text-pink-600 mx-auto" />
            <p className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-relaxed italic">
              “Your NIMCET journey begins with one decision —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                believing you can do it.
              </span>”
            </p>
            <p className="text-gray-500 text-lg">
              Join <b>ACME Academy</b> — India’s <b>#1 MCA Coaching Institute</b> trusted by toppers across Kanpur, Raipur, and all over India.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Button
                className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-6 py-3 rounded-full hover:scale-105 transition"
                onClick={() => (window.location.href = "/acme-academy-results")}
              >
                Explore Our Results
              </Button>
            </div>
          </motion.div>
        </div>

        {/* 📍 Map Section */}
        <div className="mt-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {centers.map((center, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-md border border-pink-100 bg-white/90 backdrop-blur-sm"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 mb-1">
                  {center.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{center.address}</p>
                <a
                  href={`tel:${center.phone}`}
                  className="text-pink-600 text-sm hover:underline"
                >
                  {center.phone}
                </a>
              </div>
              <iframe
                src={center.embedMap}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${center.name} Location`}
              ></iframe>
            </motion.div>
          ))}
        </div>
<div className="mt-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
  {stats.map((s, i) => (
    <AnimatedStat
      key={i}
      icon={s.icon}
      value={s.value}
      label={s.label}
      delay={i * 0.1}
    />
  ))}
</div>

      </section>
         
    </div>
  );
};

export default Contact;
