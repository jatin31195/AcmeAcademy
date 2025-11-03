import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      q: "What is the duration of the NIMCET course?",
      a: "Our full-time NIMCET batch runs for 8 months with complete syllabus coverage and weekly mock tests.",
    },
    {
      q: "Is online coaching available?",
      a: "Yes, we offer live interactive online classes with recorded sessions and online doubt-solving.",
    },
    {
      q: "Does ACME provide mock tests?",
      a: "Absolutely. We provide 50+ sectional and 10 full-length mock tests with performance analytics.",
    },
    {
      q: "What is the batch strength?",
      a: "Each batch has a limited size of 40 students to ensure personal attention.",
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
