"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqs } from "@/lib/faq-data";

// Ported from client/src/components/home/FAQSection.jsx. The FAQ list
// (lib/faq-data.ts) is a hardcoded constant (not fetched), so — unlike
// CoursesSection's fetch-dependent JSON-LD — its FAQPage JSON-LD is fully
// deterministic and is rendered server-side instead, in
// app/(marketing)/page.tsx, for guaranteed presence in the initial HTML
// (same values, more reliable delivery than the original's client-only
// react-helmet-async injection). The Accordion itself still needs Client
// (Radix state).

const FAQSection = () => {
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
