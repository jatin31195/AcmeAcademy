import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
  {
    q: "What is the duration of the NIMCET course?",
    a: "Our full-time NIMCET batch runs for 10 months, and the entire syllabus is covered twice with weekly mock tests and regular revisions.",
  },
  {
    q: "Is online coaching available?",
    a: "Yes, we offer live interactive online classes with recorded sessions, online doubt-solving, and affordable pricing for all students.",
  },
  {
    q: "Does ACME provide mock tests?",
    a: "Absolutely. We provide 1000+ mock tests, including live and pre-uploaded practice tests, along with detailed performance analytics.",
  },
  {
    q: "What is the batch strength?",
    a: "We proudly train over 700+ students every year while ensuring dedicated mentorship and consistent performance tracking.",
  },
];


  return (
    <section className="py-24 bg-muted/20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          className="text-4xl font-heading font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Frequently Asked <span className="gradient-text">Questions</span>
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
