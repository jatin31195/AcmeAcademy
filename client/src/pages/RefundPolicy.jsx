import React from "react";

const sections = [
  {
    title: "1. Introduction",
    body: [
      "This Refund and Cancellation Policy outlines the terms governing fee payments, cancellations, and refunds for services offered by Acme Academy.",
      "By enrolling in any course, program, or service provided through www.acmeacademy.in or offline centers of Acme Academy, you agree to the terms stated in this policy.",
    ],
  },
  {
    title: "2. General Refund Policy",
    body: [
      "All fees paid to Acme Academy are non-refundable under normal circumstances.",
      "Once a student is enrolled and payment is successfully processed, no refund request shall be entertained.",
    ],
  },
  {
    title: "3. Exceptions for Refund",
    body: [
      "Refunds may be considered only under the following conditions:",
      "Batch Cancellation by Academy: If a course or batch is cancelled by Acme Academy, students will be eligible for a full refund of the amount paid.",
      "Duplicate Payment: In case of accidental duplicate transactions, the extra amount will be refunded after verification.",
      "Technical Errors: If payment is deducted but enrollment is not confirmed due to technical issues, the amount will either be refunded or adjusted.",
    ],
  },
  {
    title: "4. No Refund Scenarios",
    body: [
      "Refunds will not be provided in the following situations:",
      "Change of mind after enrollment.",
      "عدم attendance or partial attendance of classes.",
      "Dissatisfaction with teaching style or course content.",
      "Failure to meet academic expectations.",
      "Disciplinary removal or termination due to misconduct.",
    ],
  },
  {
    title: "5. Cancellation Policy",
    body: [
      "Students may request cancellation of enrollment; however, such cancellation does not qualify for a refund.",
      "Cancellation requests must be submitted through official communication channels.",
    ],
  },
  {
    title: "6. Fee Transfer and Adjustment",
    body: [
      "Fee transfer to another batch or course is not guaranteed and will be subject to approval by Acme Academy.",
      "Any approved transfer may involve administrative charges.",
    ],
  },
  {
    title: "7. Processing of Refunds (If Applicable)",
    body: [
      "Approved refunds will be processed within 7 to 15 working days.",
      "Refunds will be issued through the original payment method or via bank transfer.",
      "Acme Academy is not responsible for delays caused by banks or payment gateways.",
    ],
  },
  {
    title: "8. User Responsibility",
    body: [
      "Students are advised to carefully review course details, eligibility, and schedules before making payment.",
      "By completing payment, you confirm that you understand and accept this Refund Policy.",
    ],
  },
  {
    title: "9. Modifications to Policy",
    body: [
      "Acme Academy reserves the right to update or modify this Refund Policy at any time without prior notice. Updated policies will be published on the website.",
    ],
  },
  {
    title: "10. Contact for Refund Queries",
    body: [
      "For any refund-related concerns or queries:",
      "Email: team@acmeacademy.in",
      "Website: www.acmeacademy.in",
    ],
  },
  {
    title: "11. Governing Law",
    body: [
      "This policy shall be governed by the laws of India, and any disputes shall fall under the jurisdiction of courts in Raipur, Chhattisgarh.",
    ],
  },
];

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <section className="relative overflow-hidden py-14 sm:py-16 border-b border-slate-200">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-red-100 blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-60" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-600 uppercase">
            Legal and Compliance
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Refund and Cancellation Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Effective Date: 5 April 2026 | Website: www.acmeacademy.in
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="space-y-5 sm:space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-slate-700">
                {section.body.map((line, index) => (
                  <p key={`${section.title}-${index}`}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
