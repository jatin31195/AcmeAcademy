import { motion } from "framer-motion";
import { Workflow } from "lucide-react";


const HowItWorks = () => {
  const steps = [
    {
      title: "Step 1: Enroll",
      desc: "Join the batch that matches your target exam and learning pace.",
    },
    {
      title: "Step 2: Learn",
      desc: "Attend interactive live classes or offline sessions with expert mentors.",
    },
    {
      title: "Step 3: Practice",
      desc: "Attempt regular quizzes, mock tests, and PYQs to sharpen accuracy.",
    },
    {
      title: "Step 4: Succeed",
      desc: "Crack your MCA entrance with confidence and join your dream college!",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-heading font-bold mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How <span className="gradient-text">ACME Academy</span> Works
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-xl hover-glow"
            >
              <Workflow className="w-10 h-10 text-primary" />

              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
